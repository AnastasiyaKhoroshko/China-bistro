$(function () {
    $("#navbarButton").blur(function (event) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 991) {
            $("#navbarSupportedContent").collapse('hide');
        }
    });
});

(function (global) {

    var dc = {};

    var homeHtml = "snippet/home-snippet.html";
    var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippet/categories-title-snippet.html";
    var categoryHtml = "snippet/category-snippet.html";
    var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippet/menu-items-title.html";
    var menuItemHtml = "snippet/menu-item.html";

    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    var showLoading = function (selector) {
        var html = "<div class ='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };


    document.addEventListener("DOMContentLoaded", function (event) {
        showLoading("#main-content");
        $.ajax({
            type: "GET",
            url: homeHtml,
            success: function (responseText) {
                document.querySelector("#main-content")
                    .innerHTML = responseText;
            }
        });
    });
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $.ajax({
            type: "GET",
            url: allCategoriesUrl,
            success: buildAndShowCategoriesHTML
            // error: function (xhr, ajaxOptions, thrownError) {
            //     alert(xhr.status);
            //     alert(thrownError);
            // }
        });
    };
    dc.loadMenuItems = function (categoryShort) {
        showLoading("#main-content");
        $.ajax({
            type: "GET",
            url: menuItemsUrl + categoryShort,
            success: buildAndShowMenuItemsHTML
        })
    };

    function buildAndShowCategoriesHTML(categories) {
        $.ajax({
            type: "GET",
            url: categoriesTitleHtml,
            success: function (categoriesTitleHtml) {
                $.ajax({
                    type: "GET",
                    url: categoryHtml,
                    success: function (categoryHtml) {
                        var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml);
                    }
                });
            }
        })
    };
    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";
        for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    };

    function buildAndShowMenuItemsHTML(categoryMenuItems) {
        $.ajax({
            type: "GET",
            url: menuItemsTitleHtml,
            success: function (menuItemsTitleHtml) {
                $.ajax({
                    type: "GET",
                    url: menuItemHtml,
                    success: function (menuItemHtml) {
                        var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
                        insertHtml("#main-content", menuItemsViewHtml);
                    }
                })
            }
        })
    };

    function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
        menuItemsTitleHtml = insertTitleInstruction(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instruction);
        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";
        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for (var i = 0; i < menuItems.length; i++) {
            var html = menuItemHtml;
            html = insertProperty(html, "short_name", menuItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertItemPrice(html, "price_small", menuItems[i].price_small);
            html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
            html = insertItemPrice(html, "price_large", menuItems[i].price_large);
            html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
            html = insertProperty(html, "name", menuItems[i].name);
            html = insertProperty(html, "description", menuItems[i].description);
            if (i % 2 != 0) {
                html += "<hr class='d - block d - sm - none'>"
            }
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    };

    function insertTitleInstruction(menuItemsTitleHtml, specialPropName, titleValue) {
        if (!titleValue) {
            return insertProperty(menuItemsTitleHtml, specialPropName, "")
        }

    }
    function insertItemPrice(html, pricePropName, priceValue) {
        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }
        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html
    };
    function insertItemPortionName(html, portionPropName, portionValue) {
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }


    global.$dc = dc;
})(window);
