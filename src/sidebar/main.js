// import _bootstrap from 'bootstrap/dist/css/bootstrap.css';
import './main.scss';
import $ from 'jquery';
import URL from 'url-parse';
import moment from 'moment';

$(() => {
    let btnStop = $('#stop');
    let btnStart = $('#start');
    let div= $('.url-info');

    let tblInfo = $('#info');
    tblInfo.hide();

    let listener;
    let counter = 0;
    let listening = false;
    let timeString = 'HH:mm:ss';

    let addRow = (count, method, url, timestamp) => {
        var uInfo = new URL(url);
        let c = $('<td/>').html(count);
        let t = $('<td/>').html(moment(timestamp).format(timeString));
        let m = $('<td/>').html(method);
        let u = $('<td/>').html(uInfo.pathname);

        let r = $('<tr/>').append(c).append(t).append(m).append(u);
        console.log('addRow:', $('tbody', tblInfo));

        $('tbody', tblInfo).append(r);
    };
    
    btnStart.click(() => {
        browser.windows.getCurrent({ populate: true })
            .then(windowInfo => windowInfo.id)
            .then(winId => {
                return browser.tabs.query({ windowId: winId, active: true })
                .then(tabs => Promise.resolve({ 
                        tab: tabs[0], 
                        windowId: winId 
                    })
                );
            })            
            .then(info => {
                let { tab, windowId } = info;
                let urlInfo = new URL(tab.url);
                // let filter = browser.webRequest.RequestFilter();
                let filter = {};
                
                console.log('Info:', info);

                filter.windowId = windowId;
                filter.tabId = tab.id;
                // console.log('Filter:', urlInfo.origin + '/*')
                filter.urls = [ urlInfo.origin + '/*' ]

                listener = (reqInfo) => {
                    let { method, url, timeStamp } = reqInfo;
                    counter++;
                    // console.log('URL:', url);
                    addRow(counter, method, url, new Date(timeStamp));
                };

                browser
                    .webRequest
                    .onBeforeRequest
                    .addListener(listener, filter);

                listening = true;
                tblInfo.show();
                btnStart.hide();
                btnStop.show();
                div.addClass('border-wrap');
            })
    });

    btnStop.click(()=> {
        listening = false;
        browser.webRequest.onBeforeRequest.removeListener(listener);
        $('tbody', tblInfo).empty();
        tblInfo.hide();
        btnStart.show();
        btnStop.hide();
        counter = 0;
        div.removeClass('border-wrap');
    });

    
});
