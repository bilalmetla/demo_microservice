

var winston = require('winston');
require('winston-daily-rotate-file');
let tracing = {
    "level": "debug", // you can set one of them as log level = "error", "warn", "info", "verbose", "debug", "silly"
    "consoleModeEnable": false,
    "fileModeEnable": true,
    zippedArchive: true,
    maxSize: '2g',
    maxFiles: '14d'
};

class Logger {

    constructor(){
        this.logLevel = tracing.level;
        this.transportsList =  [];
    }

    //methods
    initLogger(){

        winston.addColors({
            error: 'red',
            warn: 'yellow',
            info: 'cyan',
            debug: 'green',
            verbose: 'blue'
        });



        if(tracing.consoleModeEnable){
            this.transportsList.push(new(winston.transports.Console)({
                level: process.currentLogLevel || this.logLevel,
                colorize: true,
                timestamp: true,
                prettyPrint: true
            }));
        }

        if(tracing.fileModeEnable){
            this.transportsList.push(new(winston.transports.DailyRotateFile)({
                level: process.currentLogLevel || this.logLevel,
                filename: process.cwd()+'/logs/node_traces_%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: tracing.zippedArchive,
                maxSize: tracing.maxSize,
                maxFiles: tracing.maxFiles,
                timestamp: true,
                prettyPrint: true
            }));
        }

        return this;


    }

    createLogger(){

        if(this.winstonLogger){
           return this.winstonLogger;
        }
        /*following is compatible with winston@3.1.0 version*/
        const logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: this.transportsList,
            exceptionHandlers: [
                new(winston.transports.File)({
                    level: process.currentLogLevel || this.logLevel,
                    filename: process.cwd()+'/logs/exceptions.log',
                    timestamp: true,
                    prettyPrint: true
                })
            ]
        });

        this.winstonLogger = logger;
        return this;
    }

    updateLogLevel (level) {

        for(var i= 0; i<this.transportsList.length; i++){
            if(this.transportsList[i] && this.transportsList[i].level){
                this.transportsList[i].level = level;
            }
        }

    }

    debug () {
        var args = Array.prototype.slice.call(arguments);
        var str = args.join(" ");
        str = this.removeSensitiveInfo(str);
        this.winstonLogger.log.apply(this.winstonLogger, ["debug", str]);
    }

    info(){
        var args = Array.prototype.slice.call(arguments);
        var str = args.join(" ");
        this.winstonLogger.log.apply(this.winstonLogger, ["info", str]);
    }

    error(){
        var args = Array.prototype.slice.call(arguments);
        var str = args.join(" ");
        this.winstonLogger.log.apply(this.winstonLogger, ["error", str]);
    }

    silly(){
        var args = Array.prototype.slice.call(arguments);
        var str = args.join(" ");
        this.winstonLogger.log.apply(this.winstonLogger, ["silly", str]);
    }

    warn(){
        var args = Array.prototype.slice.call(arguments);
        var str = args.join(" ");
        this.winstonLogger.log.apply(this.winstonLogger, ["warn", str]);
    }

    verbose(){
        var args = Array.prototype.slice.call(arguments);
        var str = args.join(" ");
        this.winstonLogger.log.apply(this.winstonLogger, ["verbose", str]);
    }

    //This method will prevent Sensitive information to be Logs.
    removeSensitiveInfo(str){
        var sensitiveKeys=['PASSWORD', 'userPassword', 'password','pin','PIN','securityCode', 'USERNAME',  'username', 'cardNo', 'CARDNO', 'cardPIN', 'cardNumber', 'bankPAN', 'bankPIN', 'cvv', 'CVV'];
        sensitiveKeys.forEach(key=> str = str.replace( new RegExp("\"" + key + "\"[ ]*:[^,}\\]]*[,]?", ""),''));
        return str;
    }


}

var logger = new Logger();

logger.initLogger().createLogger();


module.exports = logger;
