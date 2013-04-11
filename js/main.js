window.Calculator = Backbone.View.extend({
    template:_.template($('#home').html()),

    render:function (eventName) {
	$(this.el).html(this.template());
	return this;
    },

    initialize: function () {
	this.fVal = 0;
	this.sVal = 0;
	this.op = "";
	this.opped = false;
	this.dotted = false;
	this.done = false;
	this.count = 0;
	this.root = false;
	this.toRoot = "";
	this.expo = false;

	$("#display").html("0.");
	$("#summary").html("");
    },

    events: {
	"click .number" : "addNumber",
	"click .dot" : "dot",
	"click .op" : "operate",
	"click .sqrt" : "sqrt",
	"click .exp" : "exponential",
	"click .equal" : "equal",
	"click .c" : "clear",
	"click .ac" : "initialize"
    },

    addNumber: function(e) {
	if (this.count == 9) return;

	var number = $(e.currentTarget).html()

	var onScreen = $("#display").html();

	if ((onScreen == "0." && !this.dotted) || onScreen == "0" || this.done) {
	    $("#display").html(number);
	    $("#summary").html(number);
	}
	else {
	    $("#display").html(onScreen + number);
	    $("#summary").html($("#summary").html() + number);
	}

	this.count++;
	this.done = false;

	if (this.root) {
	    this.toRoot = this.toRoot + number;
	}
	$("#summary").addClass("summary");
    },

    dot: function(e) {
	var onScreen = $("#display").html();
	if (!this.dotted) {
	    if (this.done) {
		$("#display").html("0.");
		$("#summary").html("0.");
	    }
	    else if ($("#display").html() != "0.") {
		if (onScreen[onScreen.length - 1] == " ") {
		    $("#display").html(onScreen + "0.");

		    $("#summary").html($("#summary").html() + "0.");
		}
		else {
		    $("#display").html(onScreen + ".")

		    if (this.done) {
			$("#summary").html(onScreen + ".");
		    }
		    else {
			$("#summary").html($("#summary").html() + ".");
		    }
		}
	    }
	    else {
		$("#summary").html("0.")
	    }

	    this.dotted = true;
	    this.done = false;

	}
    },

    operate: function (e) {
	var onScreen = $("#display").html();

	if (onScreen[onScreen.length - 1] == ":") return;

	if (onScreen[onScreen.length - 1] == " ") {
	    return;
	}

	var last_op = this.op;

	this.check();

	var op = $(e.currentTarget).html();

	if (last_op == "+" || last_op == "-") {
	    if (op != "+" && op != "-") {
		$("#summary").html("(" + $("#summary").html() + ")");
	    }
	}
	else if (last_op == "x" || last_op == "/") {
	    if (op == "+" || op == "-" || op == "/") {
		$("#summary").html("[ " + $("#summary").html() + " ]");
	    }
	}


	if (this.opped) {
	    this.equal();
	}

	onScreen = $("#display").html();
	if (onScreen == "Error") {
	    return;
	}
	this.done = false;
	this.op = op;

	if (onScreen.indexOf("=") != -1) {
	    var newVal = onScreen.split(" = ");
	    $("#display").html(newVal[1] + " " + this.op + " ");
	}
	else {
	    $("#display").html(onScreen + " " +  this.op + " ");
	}

	$("#summary").html($("#summary").html() + " " + this.op + " ");

	this.opped = true;
	this.dotted = false;
	this.count = 0;
    },

    sqrt: function() {
	var onScreen = $("#display").html();

	this.check("exp");

	if (onScreen == "0." || this.done) {
	    $("#display").html("sqrt:")
	    $("#summary").html("sqrt:")
	}
	else if (onScreen[onScreen.length - 1] == " ") {
	    $("#display").html(onScreen + "sqrt:")
	    $("#summary").html($("#summary").html() + "sqrt:")
	}
	else {
	    return;
	}

	this.root = true;
	this.done = false;
    },

    doRoot: function() {
	var split = $("#display").html().split("sqrt:");

	return Math.sqrt(parseFloat(split[1]));

	this.root = false;
	this.toRoot = "";
    },

    exponential: function() {
	var onScreen = $("#display").html();

	var last_digit = onScreen[onScreen.length - 1];
	if (last_digit == " " || last_digit == ":" || onScreen == "0.") return;

	this.check("sqrt");

	$("#display").html($("#display").html() + ":exp:")
	$("#summary").html($("#summary").html() + ":exp:");

	this.expo = true;
	this.done = false;
    },

    check: function(val) {

	if ((val == "sqrt" || !val) && this.root) {
	    if (this.toRoot == "") return;

	    var d_root = this.doRoot();

	    var split = $("#display").html().split("sqrt:");

	    $("#display").html(split[0] + d_root);
	}

	if ((val == "exp" || !val) && this.expo) {
	    var splt = $("#display").html().split(":exp:");

	    var for_base = splt[0].split(" ");
	    var base = parseFloat(for_base[for_base.length-1]);
	    var pre = splt[0].replace(base, "");

	    var for_exp = splt[1].split(" ");
	    var exp = parseFloat(for_exp[0]);
	    var post = splt[1].replace(exp,"");

	    $("#display").html(pre + Math.pow(base, exp) + post);

	this.expo = false;
	}
    },

    equal: function() {
	if (this.op == "" && !this.root && !this.expo) {
	    return;
	}

	this.check();

	var values = $("#display").html().split(this.op);

	val1 = parseFloat(values[0]);
	val2 = parseFloat(values[1]);

	var res;
	switch (this.op) {
	    case "/":
		res = val1 / val2;
		break;
	    case "x":
		res = val1 * val2;
		break;
	    case "+":
		res = val1 + val2;
		break;
	    case "-":
		res = val1 - val2;
		break;
	}

	if (isNaN(res)) {
	    res = "Error";
	}

	this.opped = false;
	this.dotted = false;

	$("#display").html(res);
	this.done = true;
    },

    clear: function() {
	// clear last entry
	var onScreen = $("#display").html();

	if (onScreen == "0.") return;

	var delChar = 1;
	if (onScreen[onScreen.length - 1] == " ") {
	    delChar = 3;
	    this.last_op = "";
	}
	else if (onScreen.substr(onScreen.length - 5, 5) == "sqrt:" || onScreen.substr(onScreen.length - 5, 5) == ":exp:") {
	    delChar = 5;
	}

	$("#display").html($("#display").html().slice(0, onScreen.length - delChar));
	$("#summary").html($("#summary").html().slice(0, onScreen.length - delChar));

	if ($("#display").html() == "") {
	    this.initialize();
	}
    }
});

window.AboutView = Backbone.View.extend({
    template:_.template($('#about').html()),

    render:function (eventName) {
	$(this.el).html(this.template());
	return this;
    }
});

var AppRouter = Backbone.Router.extend({

    routes:{
	"":"home",
	"about":"about",
	"page2":"page2"
    },

    initialize:function () {
	// Handle back button throughout the application
	$('.back').live('click', function(event) {
	    window.history.back();
	    return false;
	});
	this.firstPage = true;
    },

    home:function () {
	console.log('#home');
	this.changePage(new Calculator());
    },

    about:function () {
	console.log('#about');
	this.changePage(new AboutView());
    },

    changePage:function (page) {
	$(page.el).attr('data-role', 'page');
	page.render();
	$('body').append($(page.el));

	var transition = $.mobile.defaultPageTransition;
	// We don't want to slide the first page
	if (this.firstPage) {
	    transition = 'pop'; // mine
	    this.firstPage = false;
	}

	$.mobile.changePage($(page.el), {
	    changeHash:false,
	    transition: transition
	});
    }

});

$(document).ready(function () {
    console.log('document ready');
    app = new AppRouter();
    Backbone.history.start();
});