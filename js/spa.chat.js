// spa.chat.js

spa.chat = (function(){
    //module scope variables
    var configMap = {
        main_html : String()
            + '<div class="spa-chat">'
            + '<div class="spa-chat-head">'
            + '<div class="spa-chat-head-toggle">+</div>'
            + '<div class="spa-chat-head-title">'
            + 'Chat'
            + '</div>'
            + '</div>'
            + '<div class="spa-chat-closer">x</div>'
            + '<div class="spa-chat-sizer">'
            + '<div class="spa-chat-msgs"></div>'
            + '<div class="spa-chat-box">'
            + '<input type="text"/>'
            + '<div>send</div>'
            + '</div>'
            + '</div>'
            + '</div>',
        settable_map : {
            slider_open_time :true,
            silder_close_time : true,
            slider_opened_em : true,
            slider_closed_em : true,
            slider_opened_title : true,
            slider_closed_title : true,

            chat_model : true,
            people_model : true,
            set_chat_anchor : true
        },

        slider_open_time:250,
        slider_close_time:25,
        slider_opened_em:16,
        slider_closed_em:2,
        slider_opened_title:'Click to close',
        slider_closed_title:'Click to open',

        chat_model:null,
        people_model:null,
        set_chat_anchor:null
    },
    stateMap = {$container : null

    },
    jqueryMap = {},
    setJqueryMap,configModule,initModule;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {$container : $container};
    };

    configModule = function (input_map){
        spa.util.setConfigMap({
            input_map : input_map,
            settable_map : configMap.settable_map,
            config_map : configMap
        });
        return  true;
    };

    initModule = function($container){
        $container.html(configMap.main_html);
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    };

    return {
        configModule : configModule,
        initModule : initModule
    }
}());