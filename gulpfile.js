'use strict';

var gulp = require('gulp');

var s3 = require('gulp-upload-s3');

var s3empty = require('s3-bucket-empty');

var s3Conf = {
    S3_SECRET: 'Nn7KeFZfKDfNsc0Mq8LICuR36TZQihLdfBnpsIjK',
    S3_ACCESS_KEY: 'AKIAOWMOM42TKTF4XAJA',
    S3_REGION: 'cn-north-1'
};

gulp.task('s3', ()=>{
    s3empty.empty(s3Conf, 'labor-activities').then(()=>{
        gulp.src('./dest/**').pipe(s3({
            key:    'AKIAOWMOM42TKTF4XAJA',
            secret: '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',
            region: 'cn-north-1',
            bucket: 'labor-activities',
        }));
    })
   
});

var { generateTheme } = require('theme-color-generator');
var Path = require('path');

var options = {
    stylesDir: Path.join(__dirname, './src/'),
    varFile: Path.join(__dirname, './src/assets/css/variable.less'),
    outputFilePath: Path.join(__dirname, './theme/css/theme.less')
}

gulp.task('generate-theme', ()=>{
    generateTheme(options).then(() => {
        console.log('Theme generated successfully');
    }).catch(error => {
        console.log('Error', error);
    })
})
