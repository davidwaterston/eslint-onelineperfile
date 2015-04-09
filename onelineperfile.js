'use strict';

var chalk = require('chalk');
var table = require('text-table');

var pluralize = function(word, count) {
    var plural = count === 1 ? word : word + 's';
    return plural;
};

module.exports = function(results) {

    var errorColor = 'red';
    var errorPrefix = 'ERROR';
    var successColor = 'black';
    var successPrefix = 'SUCCESS';
    var warningColor = 'yellow';
    var warningPrefix = 'WARNING';

    var errorCount = 0;
    var fileCount;
    var failureCount = 0;
    var passCount = 0;
    var warningCount = 0;

    var color;
    var prefix;

    var lineArray;
    var outputArray = [];
    var summaryLineArray;


    results.forEach(function(result) {

        var messages = result.messages;

        if (messages.length === 0) {
            passCount++;
            lineArray = [chalk[successColor].dim(successPrefix), chalk.dim(result.filePath), '', '', '', ''];
        } else {
            failureCount++;
            warningCount += result.warningCount;
            errorCount += result.errorCount;
            if (result.errorCount) {
                prefix = errorPrefix;
                color = errorColor;
            } else {
                prefix = warningPrefix;
                color = warningColor;
            }
            lineArray = [
                chalk[color].bold(prefix),
                chalk[color].bold(result.filePath),
                chalk[color].bold(result.warningCount),
                chalk[color].bold(pluralize('warning', result.warningCount)),
                chalk[color].bold(result.errorCount),
                chalk[color].bold(pluralize('error', result.errorCount))
            ];
        }

        outputArray.push(lineArray);

    });

    fileCount = passCount + failureCount;

    summaryLineArray = [
        chalk.bold(fileCount + ' ' + pluralize('file', fileCount) + ' checked.'),
        chalk.bold(passCount + ' passed.'),
        chalk.bold(failureCount + ' failed.')
    ];

    if (warningCount || errorCount) {
        summaryLineArray.push(chalk[warningColor].bold(warningCount + ' ' + pluralize('warning', warningCount) + '.'));
        summaryLineArray.push(chalk[errorColor].bold(errorCount + ' ' + pluralize('error', errorCount) + '.'));
    }

    return '\n'
            + table(outputArray, {align: ['l', 'l', 'r', 'l', 'r', 'l']})
            + '\n\n'
            + table([summaryLineArray]);

};
