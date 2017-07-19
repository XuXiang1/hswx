      App.controller('shouyin', function(page) {
          this.restorable = false;
          check_login(page);
          page.querySelector('.top-bar-btn-home').addEventListener('click', function() {
              App.load('home', 'fade');
          });
          page.addEventListener('appLayout', function() {
              myScroll = new IScroll(page.querySelector('#wrapper'), {
                  scrollX: true,
                  scrollY: false,
                  mouseWheel: true
              });
          });
          // $(document).ready(function() {
          //     var vm = new Vue({
          //         el: '#goodslist',
          //         data: {
          //             data: {
          //                 goodslist: [{
          //                     name: "五粮液",
          //                     url: "",
          //                     currentprice: 100,
          //                     oldprice: 20,
          //                     count: 1,
          //                     goodstool: 0
          //                 }, {
          //                     name: "五粮液2",
          //                     url: "",
          //                     currentprice: 120,
          //                     oldprice: 30,
          //                     count: 2,
          //                     oodstool: 0,
          //                 }],
          //                 tol: {}
          //             }
          //         },
          //         methods: {
          //             goodssum: function(goods) {
          //                 goods.count += 1;
          //             }
          //         },
          //         computed: {
          //             // a computed getter
          //             goodstool: function() {
          //                 return this.data.goodslist.filter(function(good) {
          //                     alert(good.currentprice)
          //                     return good.currentprice * good.count;
          //                 })
          //             }
          //         }
          //     })
          //     console.dir(vm);
          // });
      });
      //收银确认窗口
      function show_goods_confirm_block() {
          //获取现有数据
          $(".goods-confirm-block").show();
          show_mask();
      }
      //关闭收银确认窗口
      function hide_goods_confirm_block() {
          //获取现有数据
          $(".goods-confirm-block").hide();
          hide_mask();
      }
      //整单折扣弹窗
      function show_total_ticket_discount(){
      	  $(".goods-confirm-block").css("z-index","9998");
      	  $(".total-ticket-discount-block").show();
          show_mask();
      }
