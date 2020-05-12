import { Sequelize, Model, DataTypes } from 'sequelize';
// const {  } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

class User extends Model { }
User.init({
    username: DataTypes.STRING,
    birthday: DataTypes.DATE
}, { sequelize, modelName: 'user' });

export class DbContext {

    public seed_db() {
        sequelize.sync()
            .then(() => User.create({
                username: 'janedoe',
                birthday: new Date(1980, 6, 20)
            }))
            .then((jane: any) => {
                console.log(jane.toJSON());
            });
    }

    public get_users() {
        sequelize.sync()
            .then(() => {
                User.findAll({
                    attributes: ['username']
                });
            }).
            then((user: any) => {
                console.log(user);
            });
    }
}