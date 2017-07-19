//显示登陆窗口
var USER_DATA = {
    access_code: "",
    account: "",
    branchid: "",
    branchname: "",
    cashiergrant: "",
    fullname: "",
    headpic: "",
    id: "",
    isbuyprice: "",
    iscashier: "",
    mindiscount: "",
    shopcode: "",
    shopname: "",
    username: "",
    password: ""
};
var TEMP_PASS = "";
var IMG_DOOR = "http://oss-cn-shanghai.aliyuncs.com/xiaxinet0827/";
var API_DOOR = "http://192.168.1.114:9001/api/api-bin/";
var CURRENT_PAGE = "";
$(function() {
    // 也可以在页面中引入 amazeui.datetimepicker.zh-CN.js
    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        suffix: [],
        meridiem: ["上午", "下午"]
    };
});
var myScroll = null;
//主页大连接点击后的效果
function show_shadow_to_link(obj, cssname) {
    $(obj).addClass("box-shadow-" + cssname);
    setTimeout(function() {
        $(obj).removeClass("box-shadow-" + cssname);
    }, 200);
}

function show_login_block() {
    show_mask();
    login_switch("phone");
    $(".login-block").show();
}

function hide_login_block() {
    login_clear_input();
    hide_mask();
    $(".login-block").hide();
}

function login_switch(flag) {
    login_clear_input();
    if (flag == "phone") {
        $(".login-block-item-phpne").addClass("current");
        $(".login-block-item-account").removeClass("current");
        $("#user_phone_email").show();
        $("#user_company_id").hide();
        $("#user_company_userid").hide();
        $("#user_password").show();
    } else {
        $(".login-block-item-account").addClass("current");
        $(".login-block-item-phpne").removeClass("current");
        $("#user_phone_email").hide();
        $("#user_company_id").show();
        $("#user_company_userid").show();
        $("#user_password").show();
    }
}

function login_clear_input() {
    $(".login-block-inputs input").val("");
}

var login_callback = function(res) {
    //登录返回
    if (res) {
        USER_DATA = res.user_info;
        USER_DATA.access_code = res.access_code;
    }
    //登录成功，缓存登录数据
    var tempData = jQuery.extend(true, {}, USER_DATA);
    tempData.password = TEMP_PASS;
    tempData = JSON.stringify(tempData);
    if(typeof(HostApp) != "undefined"){
    	HostApp.saveOrUpdateUserInfo(tempData)
    }
    hide_login_block();
};
//登陆按钮点击
$(".login-block-buttons .login-btn").click(function() {
    //清空输入，加载用户信息等
    //获得登录输入
    var login_cellphone_email = $.trim($("#login_cellphone_email").val());
    var login_company_id = $.trim($("#login_company_id").val());
    var login_user_name = $.trim($("#login_user_name").val());
    var login_user_pwd = $.trim($("#login_user_pwd").val());
    var isAccountLogin = $(".login-block-item-account").hasClass("current");
    //输入验证
    var validate_result = validate_login_input(login_cellphone_email, login_company_id, login_user_name, login_user_pwd, isAccountLogin ? 'account' : '1');
    if (validate_result != "1") {
        login_err_msg(validate_result);
        return;
    }
    login_user_pwd = MD5(login_user_pwd);
    var login_data_json_str = {
        account: "",
        shopcode: "",
        username: "",
        password: ""
    };
    if (isAccountLogin) {
        //账号登录	
        login_data_json_str.shopcode = login_company_id;
        login_data_json_str.username = login_user_name;
        login_data_json_str.password = login_user_pwd;
    } else {
        //手机邮箱登录
        login_data_json_str.account = login_cellphone_email;
        login_data_json_str.password = login_user_pwd;
    }
    show_loading_btn(this);
    var url = API_DOOR + "/login/entry/login";
    TEMP_PASS = login_user_pwd;//离线缓存md5 pass
    ajaxExecute(url, login_callback, login_data_json_str);
})
//登入输入错误提示
function login_err_msg(msg) {
    $(".login-err-message").html(msg);

}
//验证登录输入
function validate_login_input(login_cellphone_email, login_company_id, login_user_name, login_user_pwd, c_type) {
    //商户ID 8位数字
    //用户ID 4位数字
    var phone_reg = /^(\d|-|\()(\d|-|\))+(\d)*$/;
    var email_reg = /^([0-9A-Za-z-_\\.]+)@([0-9a-zA-Z\\.\\-]+)$/;
    var num_8reg = /^\d{8}$/;
    var num_4reg = /^\d{4}$/;
    if (c_type == "account") {
        //商户登录
        if (login_company_id == "") {
            return "商户ID不能为空";
        } else if (!num_8reg.test(login_company_id)) {
            return "商户ID必须是8位数字";
        } else if (login_user_name == "") {
            return "用户名不能为空";
        } else if (!num_4reg.test(login_user_name)) {
            return "用户名必须是4位数字"
        } else if (login_user_pwd == "") {
            return "密码不能为空";
        } else {
            return "1";
        }
    } else {
        //手机邮箱登录
        if (login_cellphone_email == "") {
            return "商户ID不能为空";
        }
        // else if(!(phone_reg.test(login_cellphone_email) || email_reg.test(login_cellphone_email))){
        // 	return "请输入手机号或邮箱地址";
        // }
        else if (login_user_pwd == "") {
            return "密码不能为空";
        } else {
            return "1";
        }
    }
}
//登录回调
function loginCallBack(res) {
    res = JSON.parse(res);
    if(res.code == "200"){
        //离线登录成功
        login_callback(res.data);
    }
    else{
    	login_err_msg("登录失败");
    }
}
//打开新页面验证登陆信息
function check_login(page) {
    CURRENT_PAGE = page.getAttribute('data-page');
    //统一走Android 进行在线或离线登录
    if (USER_DATA.id == "") {
        show_login_block();
    } else {
        $(page).find("#top_bar_user_name").text(USER_DATA.username).attr("user_id", USER_DATA.id);
        $(page).find(".top-bar-btn-user-head").css("background-image","url("+IMG_DOOR+USER_DATA.headpic+")");
    }
}
//收银单品编辑
function show_edit_good(obj) {
    $("#goods_list_right").hide();
    $("#goods_single_edit").show();
    var itemName = $(obj).attr("itemName");
    var itemPriceOrigin = $(obj).attr("itemPriceOrigin");
    var itemPriceNow = $(obj).attr("itemPriceNow");
    var itemCount = $(obj).attr("itemCount");
}
//数字键盘点击
function calculaterClick(obj, flag) {
    //按钮闪烁
    $(obj).addClass("edit-caculater-item-active");
    setTimeout(function() {
        $(obj).removeClass("edit-caculater-item-active");
    }, 90);
    //单品编辑的数字键盘
    if ($(obj).parent().parent().hasClass("one-good-edit")) {
        if (flag == "enter") {
            return;
        }
        var current_input = $(".goods-edit-input .current");
        var current_input_value = $(".goods-edit-input .current").html();
        var origin_value = current_input_value.split("%")[0];
        var is_percent = current_input_value.indexOf("%") != -1;
        if (!current_input.hasClass("typpingNum") && flag != "del") {
            origin_value = "0";
        }
        var result_value = getCalculateResult(origin_value, flag + "");
        if (is_percent && (result_value >= 100)) {
            result_value = 100;
            current_input.removeClass("typpingNum");
        } else {
            current_input.addClass("typpingNum");
        }
        result_value = is_percent ? (result_value + "%") : result_value;
        $(".goods-edit-input .current").html(result_value);
    }
}
//
function getCalculateResult(origin_value, flag) {
    var result_value = "";
    if (flag != "." && flag != 'del' && origin_value[0] == 0 && origin_value[1] != ".") {
        result_value = flag; //Reset input num
    } else if (flag == "." && origin_value.indexOf(".") > -1) {
        result_value = origin_value; //Only one point allow input
    } else if (flag == "del") {
        if (origin_value == "") {
            result_value = "";
        } else {
            result_value = origin_value.substring(0, origin_value.length - 1);
        }
    } else {
        result_value = origin_value + flag;
    }
    return result_value;
}
// window.document.onkeydown = disableRefresh;
function disableRefresh(evt) {
    evt = (evt) ? evt : window.event
    if (evt.keyCode) {
        if (evt.keyCode == 13) {
            operator('result')
        } else if (evt.keyCode == 8) {
            input.focus();
            window.event.returnValue = false;
            operator('backspace')
        } else if (evt.keyCode == 27) {
            operator('clear')
        } else if (evt.keyCode == 48) {
            typetoinput('0')
        } else if (evt.keyCode == 49) {
            typetoinput('1')
        } else if (evt.keyCode == 50) {
            typetoinput('2')
        } else if (evt.keyCode == 51) {
            typetoinput('3')
        } else if (evt.keyCode == 52) {
            typetoinput('4')
        } else if (evt.keyCode == 53) {
            typetoinput('5')
        } else if (evt.keyCode == 54) {
            typetoinput('6')
        } else if (evt.keyCode == 55) {
            typetoinput('7')
        } else if (evt.keyCode == 56) {
            typetoinput('8')
        } else if (evt.keyCode == 57) {
            typetoinput('9')
        } else if (evt.keyCode == 96) {
            typetoinput('0')
        } else if (evt.keyCode == 97) {
            typetoinput('1')
        } else if (evt.keyCode == 98) {
            typetoinput('2')
        } else if (evt.keyCode == 99) {
            typetoinput('3')
        } else if (evt.keyCode == 100) {
            typetoinput('4')
        } else if (evt.keyCode == 101) {
            typetoinput('5')
        } else if (evt.keyCode == 102) {
            typetoinput('6')
        } else if (evt.keyCode == 103) {
            typetoinput('7')
        } else if (evt.keyCode == 104) {
            typetoinput('8')
        } else if (evt.keyCode == 105) {
            typetoinput('9')
        } else if (evt.keyCode == 110) {
            typetoinput('.')
        } else if (evt.keyCode == 106) {
            operator('multiply')
        } else if (evt.keyCode == 107) {
            operator('plus')
        } else if (evt.keyCode == 111) {
            operator('divide')
        } else if (evt.keyCode == 109) {
            operator('minus')
        }
    }
}
//禁用遮罩层点击事件
$(".mask").click(function(event) {
    event.preventDefault();
});
//切换手机登陆
$(".login-block-item-phpne").click(function() {
    login_switch("phone");
})
//切换商户登陆
$(".login-block-item-account").click(function() {
    login_switch("company");
})


//通用ajax调用
function ajaxExecute(url, callback, postdata) {
    var current_wifi_status = "";
    if(typeof(HostApp) != "undefined"){
        current_wifi_status = HostApp.getNetWorkStatus();  
    }
    if(current_wifi_status.indexOf("NETTYPE_NONE") > -1){
        var tempPostData = JSON.stringify(postdata);
        //当前是断网状态
        HostApp.login(tempPostData);
    }
    else{
        $.ajax({  
            url:url,  
            type: "post", 
            data:postdata, 
            async: false,  
            dataType: "jsonp",  
            jsonp: "callback", //服务端用于接收callback调用的function名的参数   
            jsonpCallback: "success_jsonpCallback", //callback的function名称,服务端会把名称和data一起传递回来   
            success: function(json) {
                if(json.success == "1"){
                    login_callback(json.result);
                }
                else{
                    login_err_msg("登录失败");
                }
    			hide_loading_btn($(".login-block-buttons .login-btn"));

            },  
            error: function(err){
               login_err_msg("登录失败");
               hide_loading_btn($(".login-block-buttons .login-btn"));
            }});    
    }
}

function success_jsonpCallback(json){
    // console.log(json);
}