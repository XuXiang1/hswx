      App.controller('home', function(page) {
          check_login(page);

         //点击事件
         page.querySelector('.home-link-shouying')
          .addEventListener('click', function () {
              show_shadow_to_link(this,'shouying');
              App.load('shouyin', 'fade');
          });
          page.querySelector('.home-link-xiaoshou')
          .addEventListener('click', function () {
              show_shadow_to_link(this,'xiaoshou');
              App.load('xiaoshou', 'fade');
          });
          page.querySelector('.home-link-duizhang')
          .addEventListener('click', function () {
              show_shadow_to_link(this,'duizhang');
              App.load('duizhang', 'fade');
          });
          page.querySelector('.home-link-pandian')
          .addEventListener('click', function () {
              show_shadow_to_link(this,'pandian');
          });
          page.querySelector('.home-link-tuihuo')
          .addEventListener('click', function () {
              show_shadow_to_link(this,'tuihuo');
          });
          page.querySelector('.home-link-shouhuo')
          .addEventListener('click', function () {
              show_shadow_to_link(this,'shouhuo');
          });
      });