var fs = require('fs'),
    walk = require('walk'),
    Config = require('../config/config');
/*
 * Display upload form
 */
exports.display_form = function(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.write(
        '<form action="/uploadFile" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="file">' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
    res.end();
}

/*
 * upload file
 */

exports.uploadFile = function(req, res) {
    var tmp_path = req.files.file.path;
    checkFileExist();
    var target_path = Config.MixInsideFolder + req.files.file.name;
    var is = fs.createReadStream(tmp_path);
    var os = fs.createWriteStream(target_path);
    is.pipe(os);
    is.on('end', function() {
        fs.unlinkSync(tmp_path);
    });
    res.send('File uploaded to: ' + target_path);
}

/*
 * Check File existence and create if not exist
 */

var checkFileExist = function() {
    fs.exists(Config.publicFolder, function(exists) {
        if (exists === false) fs.mkdirSync(Config.publicFolder);

        fs.exists(Config.MixFolder, function(exists) {
            if (exists === false) fs.mkdirSync(Config.MixFolder);
        });
    });
}

/**
 *get file
 */
exports.getFile = function(req, res) {
    var file = req.params.file,
        path = Config.MixInsideFolder + file,
        ext = file.substr(file.lastIndexOf('.') + 1);
    fs.readFile(path, function(error, content) {
        if (error) return reply("file not found");
        switch (ext) {
            case "pdf":
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            case "ppt":
                res.setHeader('Content-Type', 'application/vnd.ms-powerpoint');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            case "pptx":
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            case "xls":
                res.setHeader('Content-Type', 'application/vnd.ms-excel');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            case "xlsx":
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            case "doc":
                res.setHeader('Content-Type', 'application/msword');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            case "docx":
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            case "csv":
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader("Content-Disposition", "attachment; filename=" + file);
                res.end(content, 'binary');
                break;
            default:
                res.download(path);
        }
    });
};

/**
 *get fileList
 */
exports.fileList = function(req, res) {
    var files = [];
    // Walker options
    var walker = walk.walk(Config.MixFolder, {
        followLinks: false
    });

    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function() {
        return res.json(files);
    });
}