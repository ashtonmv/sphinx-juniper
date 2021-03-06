// Add Initialize Juniper button to dropdown menu
$(document).ready( function() {

    var launchMenu = undefined;
    for (var i=0; i<$('.dropdown-buttons').length; i++) {
        var dropdown = $('.dropdown-buttons')[i];
        var menuIcon = $(dropdown).siblings('button').first();
        if ($(menuIcon).attr("aria-label") == "Launch interactive content") {
            launchMenu = $('.dropdown-buttons')[i];
        }
    }
    
    if (launchMenu != undefined) {
        $("<a class='dropdown-buttons' onclick='juniperInit()'><button type='button' class='btn btn-secondary topbarbtn' title=''data-toggle='tooltip' data-placement='left'data-original-title='Initialize Juniper'>&#x1F347 &nbsp Juniper</button></a>").appendTo(launchMenu);
    }
})

// Start the Juniper connection to the Binder kernel
var nLoadFails = 0;
function startKernel(juniperInstance) {

    juniperInstance._event('requesting-kernel');

    for (var i=0; i<$(".temporaryMsg").length; i++) {
        var msg = $(".temporaryMsg")[i];
        $(msg).hide();
    }

    for (var i=0; i<$(".juniper-button").length; i++) {
        var button = $(".juniper-button")[i];
        $(button).removeClass("failed");
        $(button).removeClass("finished");
        $(button).html("<div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>");
    }

    for (var i=0; i<$(".juniper-output").length; i++) {
        var output = $(".juniper-output")[i];
        $(output).append("<p class='temporaryMsg'>Connecting to kernel...</p>");
    }

    if (juniperInstance._kernel && juniperInstance.isolateCells) {
        juniperInstance._kernel.restart();
    }
    new Promise((resolve, reject) =>
    juniperInstance.getKernel().then(resolve).catch(reject))
    .then(kernel => {
        juniperInstance._kernel = kernel;
    })
    .catch(() => {
        nLoadFails += 1;
        juniperInstance._kernel = null;
        if (juniperInstance.useStorage && typeof window !== 'undefined') {
            juniperInstance._fromStorage = false;
            window.localStorage.removeItem(juniperInstance.storageKey);
        }
        if (nLoadFails == 1) {
            // Loading the kernel often fails on the
            // first try but succeeds immediately after.
            // If at first you don't succeed...
            startKernel(juniperInstance);
        }
    })
}

// Kernel is ready to go, so make cells executable
document.addEventListener('juniper', event => {
    if (event.detail.status == 'ready') {
        for (var i=0; i<$(".juniper-button").length; i++) {
            var button = $(".juniper-button")[i];
            $(button).text("run");
            $(button).removeClass("errored");
        }
        for (var i=0; i<$(".temporaryMsg").length; i++) {
            var msg = $(".temporaryMsg")[i];
            $(msg).hide();
        }
    }
})

// Listen for events sent back by the jupyterlab KernelFutureHandler
// as cellExecuted (the name I gave them in juniper.min.js)
document.addEventListener("cellExecuted", event => {
    if (event.detail.content.execution_count) {
        var activeCell = $(".juniper-cell.active").first();
        $(activeCell).removeClass("active");

        // Display In[n], like on most jupyter servers
        var activeButton = $(activeCell).find(".juniper-button").first();
        $(activeButton).text("In [" + event.detail.content.execution_count + "]");

        // Should either be "ok" or "error"
        var status = event.detail.content.status;

        // Color the tab based on the response
        if (status == "ok") {
            // make the tab green
            $(activeButton).removeClass("errored");
            $(activeButton).addClass("finished");
        } else if (status == "error") {
            // make the tab red
            $(activeButton).removeClass("finished");
            $(activeButton).addClass("errored");
        }
    };
});

// Select the actively running juniper cell.
document.addEventListener('juniper', event => {
    if (event.detail.status == 'executing') {
        var div1 = $(event.target.activeElement).parent();

        // if the juniper-button was clicked
        if ($(div1).hasClass("juniper-cell")) {
            var activeCell = $(div1);
        }

        // if the cell was run using shift-enter
        else {
            var codeMirror = $(div1).parent();
            var juniperInput = $(codeMirror).parent();
            var activeCell = $(juniperInput).parent();            
        }

        $(activeCell).addClass("active");

        // Display loading animation
        var activeButton = $(activeCell).find(".juniper-button").first();
        $(activeButton).html("<div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>");
    }
})

// Handle various kinds of failure.

var nLoadFails = 0;

document.addEventListener('juniper', event => {

    if (event.detail.status == 'failed') {

        var trigger = $(event.target.activeElement);

        var activeCell = undefined;
        // if a juniper-button was clicked
        if ($(trigger).parent().hasClass("juniper-cell")) {
            activeCell = $(trigger).parent();
        }

        // if the cell was run using shift+enter
        else if ($(trigger).parent().hasClass("CodeMirror")){
            var codeMirror = $(trigger).parent();
            var juniperInput = $(codeMirror).parent();
            activeCell = $(juniperInput).parent();            
        }

        // if no cell was run, aka the failure occurred while
        // loading the kernel
        else {
            for (var i=0; i<$(".juniper-button").length; i++) {
                var button = $(".juniper-button")[i];
                $(button).text("reload");
                $(button).removeClass("finished");
                $(button).addClass("errored");
            }
            for (var i=0; i<$(".temporaryMsg").length; i++) {
                var msg = $(".temporaryMsg")[i];
                $(msg).text("Connecting failed.");
            }
        }

        if (activeCell != undefined) {
            // make the button of the active cell red
            var activeButton = $(activeCell).find(".juniper-button").first();
            $(activeButton).removeClass("finished");
            $(activeButton).addClass("errored");

            // Display In [], like on most jupyter servers
            $(activeButton).text("In []");

            for (var i=0; i<$(".temporaryMsg").length; i++) {
                var msg = $(".temporaryMsg")[i];
                $(msg).hide();
            }
        }
    }
})