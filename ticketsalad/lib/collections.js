/*
* File Name: collections.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: collections handles all javascript associated with importing mongo libraries and collections
*/
import { Mongo } from 'meteor/mongo';

export const Events = new Mongo.Collection('events');
export const Notifications = new Mongo.Collection('notifications');
export const Cards = new Mongo.Collection('cards');
