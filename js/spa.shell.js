/*
 * spa.shell.js
 * Shell module for SPA
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

spa.shell = (function(){
    // 'use strict';
    //module scope variable
    var configMap ={
            anchor_schema_map : {
                chat : {opened : true, closed : true}
            },

            resize_interval : 200,

            main_html : String()+
        '        <div class="spa-shell-head">'+
        '            <div class="spa-shell-head-logo">' +
                        '<h1>SPA</h1>'+
                        '<p>Javascript end to end</p>'+
                    '</div>'+
        '            <div class="spa-shell-head-acct"></div>'+
        // '            <div class="spa-shell-head-search"></div>'+
        '        </div>'+
        '        <div class="spa-shell-main">'+
        '            <div class="spa-shell-main-nav"></div>'+
        '            <div class="spa-shell-main-content"></div>'+
        '        </div>'+
        '        <div class="spa-shell-foot"></div>'+
        // '        <div class="spa-shell-chat"></div>'+//*
        '        <div class="spa-shell-modal"></div>'
            // chat_extend_time : 600,
            // chat_retract_tim
            //
            //
            //
            // e : 300,
            // chat_extend_height : 450,
            // chat_retract_height:15,
            // chat_extended_title : 'Click to retract',
            // chat_retracted_title : 'Click to extend'
        },
        stateMap = {
            $container:undefined,
            anchor_map:{},
            resize_idto : undefined
            // is_chat_retracted : true
        },
        jqueryMap = {},
        copyAnchorMap,setJqueryMap,initModule,onClickChat,
        changeAnchorPart,onHashchange,setChatAnchor,onTapAcct,onLogin,onLogout;
    //utility method
    copyAnchorMap = function(){
        return $.extend(true,{},stateMap.anchor_map);
    };
    //DOM method
    setJqueryMap = function (){
      var $container = stateMap.$container;
      jqueryMap = {
          $container:$container,
          $acct     :$container.find('.spa-shell-head-acct'),
          $nav      :$container.find('.spa-shell-main-nav')
          // $chat : $container.find('.spa-shell-chat')
      };
    };

    onTapAcct = function (event) {
      var acct_text,user_name,user = spa.model.people.get_user();
      if (user.get_is_anon()){
        user_name = prompt('Please Sign In...');
        spa.model.people.login(user_name);
        jqueryMap.$acct.text('....processing....');
      }
      else{
          spa.model.people.logout();
      }

      return false;
    };
    onLogin = function (event , login_user) {
      jqueryMap.$acct.text(login_user.name);
    };
    onLogout = function (event , logout_user){
        jqueryMap.$acct.text('Please Sign In...');
    };

    onResize = function(){
      if(stateMap.resize_idto){
          return true;
      }
      spa.chat.handleResize();
      stateMap.resize_idto = setTimeout(
          function(){stateMap.resize_idto = undefined},
          configMap.resize_interval
      );
      return true;
    };

    // toggleChat = function (do_extend,callback) {
    //     var
    //         px_chat_ht = jqueryMap.$chat.height(),
    //         is_open = px_chat_ht === configMap.chat_extend_height,
    //         is_closed = px_chat_ht === configMap.chat_retract_height,
    //         is_sliding = !is_open && !is_closed;
    //
    //     if(is_sliding){
    //         return false;
    //     }
    //
    //     if(do_extend){
    //         jqueryMap.$chat.animate(
    //             {height : configMap.chat_extend_height},
    //             configMap.chat_extend_time,
    //             function(){
    //                 jqueryMap.$chat.attr('title',configMap.chat_extended_title);
    //                 stateMap.is_chat_retracted = false;
    //                 if(callback){callback(jqueryMap.$chat);}
    //             }
    //         );
    //         return true;
    //     }
    //
    //     jqueryMap.$chat.animate(
    //         {height : configMap.chat_retract_height},
    //         configMap.chat_retract_time,
    //         function(){
    //             jqueryMap.$chat.attr('title',configMap.chat_retracted_title);
    //             stateMap.is_chat_retracted = true;
    //             if(callback){callback(jqueryMap.$chat);}
    //         }
    //     );
    //     return true;
    // };

    //changeAnchorpart
    changeAnchorPart = function(arg_map){
      var anchor_map_revise = copyAnchorMap(),
          bool_return = true,
          key_name,key_name_dep;

      KEYVAL:
      for (key_name in arg_map){
          if(arg_map.hasOwnProperty(key_name)){
              if(key_name.indexOf('_') === 0){continue KEYVAL;}
              anchor_map_revise[key_name] = arg_map[key_name];
              key_name_dep = '_' + key_name;
              if(arg_map[key_name_dep]){
                  anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
              }
              else{
                  delete anchor_map_revise[key_name_dep];
                  delete anchor_map_revise['_s' + key_name_dep];
              }
          }
      }

      try{
          $.uriAnchor.setAnchor(anchor_map_revise);
      }
      catch(error){
          $.uriAnchor.setAnchor(stateMap.anchor_map,null,true);
          bool_return = false;
      }
      return bool_return;
    };


    onHashchange = function(event){
      var anchor_map_previous = copyAnchorMap(),
          anchor_map_proposed,
          _s_chat_previous,_s_chat_proposed,
          s_chat_proposed,is_ok=true;

      try{anchor_map_proposed = $.uriAnchor.makeAnchorMap();}
      catch(error){
          $.uriAnchor.setAnchor(anchor_map_previous,null,true);
          return false ;
      }
      stateMap.anchor_map = anchor_map_proposed;

      _s_chat_previous = anchor_map_previous._s_chat;
      _s_chat_proposed = anchor_map_proposed._s_chat;

      if(!anchor_map_previous || _s_chat_previous!==_s_chat_proposed){
          s_chat_proposed = anchor_map_proposed.chat;
          switch(s_chat_proposed){
              case 'opened' :
                  // toggleChat(true);
                  is_ok = spa.chat.setSliderPosition('opened');
                  break;
              case 'closed':
                  // toggleChat(false);
                  is_ok = spa.chat.setSliderPosition('closed');
                  break;
              default :
                  // toggleChat(false);
                  spa.chat.setSliderPosition('closed');
                  delete anchor_map_proposed.chat;
                  $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
          }
      }

      if(!is_ok){
          if(anchor_map_previous){
              $.uriAnchor.setAnchor(anchor_map_previous,null,true);
              stateMap.anchor_map = anchor_map_previous;
          }
          else{
              delete anchor_map_proposed.chat;
              $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
          }
      }
      return false;
    };


    //event handler
    // onClickChat = function(event){//call toggleChat--> to change the STATE
    //     if(toggleChat(stateMap.is_chat_retracted)){
    //         $.uriAnchor.setAnchor({
    //             chat : (stateMap.is_chat_retracted?'open':'closed')
    //         });
    //     }
    //     return false;
    // };

    setChatAnchor = function(position_type){
        return changeAnchorPart({chat : position_type});
    };

    //public module
    initModule = function($container){
        //load html and jquery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        // stateMap.is_chat_retracted = true;
        // jqueryMap.$chat.attr('title',configMap.chat_retracted_title)
        //     .click(onClickChat);//if CLICK --> call onClickChat

        $.uriAnchor.configModule({
            schema_map : configMap.anchor_schema_map
        });

        spa.chat.configModule({
            set_chat_anchor : setChatAnchor,
            chat_model : spa.model.chat,
            people_model : spa.model.people
        });
        spa.chat.initModule(jqueryMap.$container);

        $(window)
            .bind('resize',onResize)
            .bind('hashchange',onHashchange)
            .trigger('hashchange');

        $.gevent.subscribe($container , 'spa-login' , onLogin);
        $.gevent.subscribe($container , 'spa-logout' , onLogout);

        jqueryMap.$acct
            .text('Please sign-in')
            .bind('utap',onTapAcct);

    };

    return {initModule:initModule};
}());







