// import _bootstrap from 'bootstrap/dist/css/bootstrap.css';
import './main.scss';
import $ from 'jquery';
import URL from 'url-parse';
import moment from 'moment';

$(() => {
    console.log($.fn.jquery);
    let btnFetch = $('#btnFetch');
    let btnDownload = $('#btnDownload');
    let tbl = $('tbody', '#info');
    // console.log(btnFetch);
    btnFetch.click((e) => {
        console.log('clicked..');
        getCurrentTab()
            .then(tabObj => {
                let { tabId } = tabObj;
                $.ajax({
                    url: '/scripts/foo.js',
                    type: 'GET',
                    dataType: 'text'
                })
                .done(contents => {
                    console.log('Contents:', contents);
                    browser.tabs.executeScript(tabId, {
                        code: contents
                    });
                })
                .fail(err => console.error(err));

                

                // browser.tabs.executeScript(tabId, {
                //     file: '/scripts/foo.js'
                // })
                // .then(result => {
                //     console.log(result);
                // })
                // .catch(err => console.error(err));
            });
    });
});


function getCurrentTab() {
    return browser.windows
        .getCurrent({ populate: true })
        .then(windowInfo => {
            return browser.tabs.query( {
                windowId: windowInfo.id,
                active: true
            })
            .then(tabs => {
                let tab = tabs[0]
                return {
                    tab,
                    windowId: windowInfo.id,
                    tabId: tab.id
                }
            });
        });
}