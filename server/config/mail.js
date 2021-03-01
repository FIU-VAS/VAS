import nodemailer from "nodemailer"
import config from "./config";
import fs from "fs";
import Handlebar from "handlebars";

let transport = null;

export const sendMail = async (mail, template, templateOpts) => {
    const html = await new Promise((resolve, reject) => {
        const options = {
            encoding: 'utf-8'
        }
        fs.readFile(template, options, (err, html) => {
            if (err) reject(err);
            resolve(html);
        })
    })
    let renderedTemplate = Handlebar.compile(html);
    mail.html = renderedTemplate(templateOpts);
    return getTransporter().sendMail(mail);
}

export const getTransporter = () => {
    if (transport) return transport;

    //Shorthand to only get interesting properties for transport
    const mailTransportProps = (({host, port, proxy, secure}) => ({host, port, proxy, secure}))(config.mail);

    transport = nodemailer.createTransport(mailTransportProps);
    if (config.mail.proxy.indexOf('socks') === 0) {
        transport.set('proxy_socks_module', require('socks'));
    }
    return transport;
}