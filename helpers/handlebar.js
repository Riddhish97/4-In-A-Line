var blockScript = {};
var blockCss = {};
var Handlebars = require('handlebars');
const {
    allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');
var util = require('handlebars-utils');
var helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});
var moment = require('moment');
const fs = require('fs');
//All custom helper class here
let customHelper = {
    /**
     * helper function for debug view variables into server log
     * @param  {string}
     * @return {null|void}
     */
    debug: function (data) {
        console.log(data);
    },
    /**
     * retrieve script from_block script var and add into layout at given position
     * @param  {string}
     * @return {string}
     */
    getScript: function (position) {
        var str = "";
        if (typeof blockScript[position] != 'undefined') {
            for (i = 0; i < blockScript[position].length; i++) {
                str += '<script src="' + blockScript[position][i] + '"></script>'
            }
            blockScript[position] = [];
        }
        return new Handlebars.SafeString(str);
    },
    /**
     * retrieve script from_block script var and add into layout at given position
     * @param  {string}
     * @return {string}
     */
    getCss: function (position) {
        var str = "";
        if (typeof blockCss[position] != 'undefined') {
            for (i = 0; i < blockCss[position].length; i++) {
                str += '<link rel="stylesheet" href="' + blockCss[position][i] + '" />'
            }
            blockCss[position] = [];
        }
        return new Handlebars.SafeString(str);
    },
    /**
     * load javascript file into perticular position
     * @param  {string} position idetifier
     * @param  {string|array} set of sript path
     * @return {null}
     */
    setScript: function () {
        var args = [];
        for (i in arguments) {
            if (typeof arguments[i] == "string")
                args.push(arguments[i]);
        };
        var position = args.shift();
        if (typeof blockScript[position] == 'undefined') {
            blockScript[position] = [];
        }
        blockScript[position] = blockScript[position].concat(args);
    },
    /**
     * load javascript file into perticular position
     * @param  {string} position idetifier
     * @param  {string|array} set of sript path
     * @return {null}
     */
    setCss: function () {
        var args = [];
        for (i in arguments) {
            if (typeof arguments[i] == "string")
                args.push(arguments[i]);
        };
        var position = args.shift();
        if (typeof blockCss[position] == 'undefined') {
            blockCss[position] = [];
        }
        blockCss[position] = blockCss[position].concat(args);
    },
    /**    
     * Function is used for concat string
     */
    concat: function () {
        let str = "";
        for (i in arguments) {
            if (typeof arguments[i] == "string") {
                str += arguments[i];
            }
        };
        return str;
    },

    env: function (key) {
        return process.env[key];
    },
    string: function (string, method) {
        const String = require('string');
        return new Handlebars.SafeString(String(string)[method]().s);
    },
    // for set date format
    date_format: function (datetime, format) {
        if (moment) {
            return moment(datetime).format(format);
        } else {
            return datetime;
        }
    },
    ifIn: function (data, key, options) {
        if (data.indexOf(key) >= 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    flashMe: function (data) {
        let title = (data.type == 'error' ? 'Error' : (data.type == 'success' ? 'Success' : ''));
        let str = '<script>toastr.' + data.type + '("' + data.message + '","' + title + '", {progressBar: !0,showMethod: "slideDown",hideMethod: "slideUp",timeOut: 2e3})</script>'
        return new Handlebars.SafeString(str);
    },
    sorting_url: function (url, field_name, display_field = null, th_classes = "") {
        const queryString = require('query-string');
        var sort = {};
        var current_url = url.split('?');
        if (typeof current_url[1] !== 'undefined') {
            sort = queryString.parse(current_url[1]);
        }
        //define sort direction class
        var sort_class = "sorting";
        if (sort['sort_field'] == field_name) {
            if (sort['sort'] == "asc") {
                sort_class = "sorting_asc";
            } else {
                sort_class = "sorting_desc";
            }
        }
        if (th_classes != "") {
            sort_class += " " + th_classes;
        }
        //if same filed sorting url then alternate direction class
        if (sort['sort_field'] == field_name && sort['sort'] == "asc") {
            sort['sort'] = "desc";
        } else {
            sort['sort'] = "asc";
        }
        sort['sort_field'] = field_name;
        var new_url = current_url[0] + "?" + queryString.stringify(sort);
        if (display_field != null) {
            return new Handlebars.SafeString('<th class="' + sort_class + '"><a href="' + new_url + '" class="d-block">' + display_field + '</a></th>');
        } else {
            return new_url;
        }
    },
    pagination: function (pagination) {
        if (pagination.totalPage == 1) {
            return null;
        }
        const queryString = require('query-string');
        var url_parts = pagination.url.split("?");
        var params = queryString.parse(url_parts[1]); //params={page:1,start:555,end:54545,ppp=777}
        delete params['page'] //params={start:555,end:54545,ppp=777}

        new_qry = queryString.stringify(params);
        new_url = url_parts[0] + "?" + new_qry;

        var string = '<nav id=""><ul class="pagination justify-content-end">';
        string += '<li class="page-item  ' + (pagination.page == 1 ? "disabled" : "") + '"><a href="' + new_url + '&page=' + (parseInt(pagination.page) - 1) + '" aria-controls="example23" data-dt-idx="0" tabindex="0"class="page-link">Previous</a></li>'

        index = range(pagination.page, pagination.totalPage);

        for (let i = 0; i < index.length; i++) {
            if (index[i] == '...') {
                string += '<li class="page-item ' + (index[i] == pagination.page ? "active" : "") + '">';
                string += '<a aria-controls="example23" data-dt-idx="1" tabindex="0" class="page-link">' + '...' + '</a>';
                string += '</li>';
            } else {
                string += '<li class="page-item ' + (index[i] == pagination.page ? "active" : "") + '">';
                string += '<a href="' + new_url + '&page=' + index[i] + '" aria-controls="example23" data-dt-idx="1" tabindex="0" class="page-link">' + index[i] + '</a>';
                string += '</li>';
            }
        }
        string += '<li class="paginate_button page-item next ' + (pagination.totalPage == pagination.page ? "disabled" : "") + '"><a href="' + new_url + '&page=' + (parseInt(pagination.page) + 1) + '" aria-controls="example23" data-dt-idx="7" tabindex="0" class="page-link">Next</a></li>'
        string += '</ul></nav>';
        a = range(1, 4)

        function range(c, m) {
            var current = c || 1,
                last = m,
                delta = 2,
                left = current - delta,
                right = parseInt(current) + delta + 1,
                range = [],
                rangeWithEllipsis = [],
                l,
                t;

            range.push(1);
            for (var i = c - delta; i <= c + delta; i++) {
                if (i >= left && i < right && i < m && i > 1) {
                    range.push(i);
                }
            }
            range.push(m);

            for (var i of range) {
                if (l) {
                    if (i - l === 2) {
                        t = l + 1;
                        rangeWithEllipsis.push(t);
                    } else if (i - l !== 1) {
                        rangeWithEllipsis.push("...");
                    }
                }
                rangeWithEllipsis.push(i);
                l = i;
            }
            return rangeWithEllipsis;
        }
        return new Handlebars.SafeString(string);
    },
    /**     
     * Function is used for convert time into default timezone
     */
    convertTz: function (time) {
        return moment(time).utcOffset(config.timezone).format('MM/DD/YYYY hh:mm A');
    },
    /**     
     * Function is used for convert time into default timezone
     */
    changeFormat: function (date, currentFormat, requiredFormat) {
        return moment(date, currentFormat).format(requiredFormat);
    },
    json: function (obj) {
        //This function is use to parse json
        return JSON.parse(obj);
    },
    length: function (value) {
        //This function is use to find length of array
        if (util.isObject(value) && !util.isOptions(value)) {
            value = Object.keys(value);
        }
        if (typeof value === 'string' || Array.isArray(value)) {
            return value.length;
        }
        return 0;
    },
    ellipsis: function (str, limit) {
        //Get string of given length
        if (util.isString(str)) {
            if (str.length <= limit) {
                return str;
            }
            return helpers.truncate(str, limit) + '…';
        }
    },

}
//Merge custom  and handlebars helpers functions
let mergedHelperObj = {
    ...helpers,
    ...customHelper
};

module.exports = {
    defaultLayout: 'default',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    // Specify helpers which are only registered on this instance.
    helpers: mergedHelperObj
};