/*
 * Non-OP posts
 */
'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	imager = require('./imager'),
	main = require('../main'),
	options = require('../options'),
	postCommon = require('./common'),
	state = require('../state');

var Article = module.exports = Backbone.View.extend({
	tagName: 'article',

	initialize: function () {
		/*
		 * XXX: A bit ineficient, because first an empty element is renderred
		 * and then a proper one.
		 *
		 * An element is not empty only on postForms
		 */
		if (this.$el.is(':empty'))
			this.render();
		this.listenTo(this.model, {
			'change:editing': this.renderEditing,
			remove: this.remove
		});
		this.initCommon();
	},

	render: function () {
		// Pass this model's links to oneeSama for renderring
		main.oneeSama.links = this.model.get('links');
		this.setElement(main.oneeSama.mono(this.model.attributes));
		// Insert into section
		main.$threads.children('#' + this.model.get('op'))
			.children('blockquote, .omit, form, article[id]:last')
			.last()
			.after(this.$el);
		this.autoExpandImage();
		return this;
	},

	renderEditing: function (model, editing) {
		this.$el.toggleClass('editing', !!editing);
		if (!editing)
			this.$el.children('blockquote')[0].normalize();
	},

	renderHide: function (model, hide) {
		this.$el.toggle(!hide);
	}
});

// Extend with common mixins
_.extend(Article.prototype, imager.Hidamari, postCommon);
