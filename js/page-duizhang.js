      App.controller('duizhang', function(page) {
          this.restorable = false;
          check_login(page);
          page.addEventListener('appLayout', function() {
              $('.form-datetime-lang').datetimepicker({
                  language: 'zh-CN',
                  format: 'yyyy-mm-dd hh:ii',
                  autoclose: true
              });
          });
      });