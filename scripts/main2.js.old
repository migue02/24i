$(document).ready(function () {
    var model = {
        cats: [
            {
                counter: 0,
                name: 'Tabby',
                image: 'images/434164568_fea0ad4013_z.png',
                imgAttribution: 'https://www.flickr.com/photos/bigtallguy/434164568'
            },
            {
                counter: 0,
                name: 'Tiger',
                image: 'images/4154543904_6e2428c421_z.png',
                imgAttribution: 'https://www.flickr.com/photos/xshamx/4154543904'
            },
            {
                counter: 0,
                name: 'Scaredy',
                image: 'images/22252709_010df3379e_z.png',
                imgAttribution: 'https://www.flickr.com/photos/kpjas/22252709'
            },
            {
                counter: 0,
                name: 'Shadow',
                image: 'images/1413379559_412a540d29_z.png',
                imgAttribution: 'https://www.flickr.com/photos/malfet/1413379559'
            },
            {
                counter: 0,
                name: 'Sleepy',
                image: 'images/9648464288_2516b35537_z.png',
                imgAttribution: 'https://www.flickr.com/photos/onesharp/9648464288'
            }
        ],
        currentCat: null
    };

    var controller = {
        init: function () {
            model.currentCat = model.cats[0];
            catsView.init();
            catView.init();
            adminView.init();
        },
        getCats: function () {
            return model.cats;
        },
        setCurrentCat: function (cat) {
            model.currentCat = cat;
        },
        getCurrentCat: function () {
            return model.currentCat;
        },
        incrementCounter: function () {
            model.currentCat.counter++;
            catView.render(model.currentCat);
        },
        renderViews: function () {
            catsView.render();
            catView.render();
            $("#adminForm").hide();
        },
        showAdmin: function () {
            $("#adminForm").show();
            adminView.render();
        }
    };

    var catView = {
        init: function () {
            this.$catSelImg = $("#catSelImg");
            this.$catArea = $("#catSelImg");
            this.$catSelNombre = $("#catSelNombre");
            this.$counterCatSel = $("#counterCatSel");
            this.$catSelImg.click(function () {
                controller.incrementCounter();
            });
            this.render();
        },
        render: function () {
            var currentCat = controller.getCurrentCat();
            this.$catSelNombre.html(currentCat.name);
            this.$catSelImg.attr('src', currentCat.image);
            this.$counterCatSel.html(currentCat.counter + " clicks");
        }
    };

    var catsView = {
        init: function () {
            this.$cats = $("#gatos");
            this.render();
        },
        render: function () {
            this.$cats.html("");
            for (var i = 0; i < controller.getCats().length; i++) {
                var cat = controller.getCats()[i];
                var button = $("<button>" + cat.name + "</button>");
                var elem = $("<li></li>");
                elem.append(button);
                this.$cats.append(elem);
                button.click((function (catCopy) {
                    return function () {
                        controller.setCurrentCat(catCopy);
                        catView.render(catCopy);
                    };
                })(cat));
            }
        }
    };

    var adminView = {
        init: function () {
            this.$buttonAdmin = $("#btnAdmin");
            this.$buttonCancelar = $("#btnCancelar");
            this.$adminForm = $("#adminForm");
            this.$catname = $("#catname");
            this.$catimage = $("#catimage");
            this.$catcounter = $("#catcounter");
            this.$adminForm.hide();
            this.$buttonAdmin.click(function () {
                controller.showAdmin();
            });
            this.$buttonCancelar.click(function () {
                this.$catname.val("");
                this.$catimage.val("");
                this.$catcounter.val("");
                this.$adminForm.hide();
            });
            this.$adminForm.submit(function (event) {
                var currentCat = controller.getCurrentCat();
                currentCat.name = $("#catname").val();
                currentCat.image = $("#catimage").val();
                currentCat.counter = $("#catcounter").val();
                controller.renderViews();
                event.preventDefault();
            });
        },
        render: function () {
            var currentCat = controller.getCurrentCat();
            this.$catname.val(currentCat.name);
            this.$catimage.val(currentCat.image);
            this.$catcounter.val(currentCat.counter);
        }
    };
    controller.init();
});

