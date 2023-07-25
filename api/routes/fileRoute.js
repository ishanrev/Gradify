
const imageRouter = require('express').Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')
const files = require('../models/File')
const connections = require('../models/Connection')
const axios = require('axios')
const mongoose = require('mongoose');


module.exports = (upload) => {
    const url = process.env.MONGOOSE_URL;
    const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

    let gfs;

    connect.once('open', () => {
        // initialize stream
        gfs = new mongoose.mongo.GridFSBucket(connect.db, {
            bucketName: "uploads"
        });
    });

    /*
        POST: Upload a single image/file to Image collection
    */
    imageRouter.route('/')
        .post(upload.single('file'), (req, res, next) => {
            console.log(req.body);
            // check for existing images
            files.findOne({ caption: req.body.caption })
                .then((image) => {
                    console.log(image);
                    // if (image) {
                    //     return res.status(200).json({
                    //         success: false,
                    //         message: 'Image already exists',
                    //     });
                    // }

                    let newImage = new files({
                        caption: req.body.caption,
                        filename: req.file.filename,
                        fileId: req.file.id,
                    });

                    newImage.save()
                        .then((image) => {

                            res.status(200).json({
                                success: true,
                                image,
                            });
                        })
                        .catch(err => res.status(500).json(err));
                })
                .catch(err => res.status(500).json(err));
        })
        .get((req, res, next) => {
            files.find({})
                .then(images => {
                    res.status(200).json({
                        success: true,
                        images,
                    });
                })
                .catch(err => res.status(500).json(err));
        });

    /*
        GET: Delete an image from the collection
    */
    imageRouter.route('/delete/:id')
        .get((req, res, next) => {
            files.findOne({ _id: req.params.id })
                .then((image) => {
                    if (image) {
                        files.deleteOne({ _id: req.params.id })
                            .then(() => {
                                return res.status(200).json({
                                    success: true,
                                    message: `File with ID: ${req.params.id} deleted`,
                                });
                            })
                            .catch(err => { return res.status(500).json(err) });
                    } else {
                        res.status(200).json({
                            success: false,
                            message: `File with ID: ${req.params.id} not found`,
                        });
                    }
                })
                .catch(err => res.status(500).json(err));
        });

    /*
        GET: Fetch most recently added record
    */
    imageRouter.route('/recent')
        .get((req, res, next) => {
            files.findOne({}, {}, { sort: { '_id': -1 } })
                .then((image) => {
                    res.status(200).json({
                        success: true,
                        image,
                    });
                })
                .catch(err => res.status(500).json(err));
        });

    /*
        POST: Upload multiple files upto 3
    */
    imageRouter.route('/multiple')
        .post(upload.array('file', 3), (req, res, next) => {
            res.status(200).json({
                success: true,
                message: `${req.files.length} files uploaded successfully`,
            });
        });

    /*
        GET: Fetches all the files in the uploads collection
    */
    imageRouter.route('/files')
        .get((req, res, next) => {
            gfs.find().toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available'
                    });
                }

                files.map(file => {
                    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg') {
                        file.isImage = true;
                    } else {
                        file.isImage = false;
                    }
                });

                res.status(200).json({
                    success: true,
                    files,
                });
            });
        });

    /*
        GET: Fetches a particular file by filename
    */
    imageRouter.route('/file/:filename')
        .get((req, res, next) => {
            gfs.find({ filename: req.params.filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                res.status(200).json({
                    success: true,
                    file: files[0],
                });
            });
        });

    /* 
        GET: Fetches a particular image and render on browser
    */
    imageRouter.route('/image/:filename')
        .get((req, res, next) => {
            gfs.find({ filename: req.params.filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                // if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                // render image to browser
                // gfs.openDownloadStreamByName(req.params.filename).pipe(res);
                gfs.openDownloadStreamByName(req.params.filename).pipe(res);
                // } else {
                //     res.status(404).json({
                //         err: 'Not an image',
                //     });
                // }
            });
        });

    /*
        DELETE: Delete a particular file by an ID
    */
    imageRouter.route('/file/del/:filename')
        .delete((req, res, next) => {
            console.log(req.params.filename);
            gfs.find({ filename: req.params.filename }).toArray((err, files) => {
                console.log(files)
                if (!files[0] || files.length === 0) {
                    console.log("here")
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }
                console.log('trying to delete')
                console.log(files[0]._id)
                gfs.delete(new mongoose.Types.ObjectId(files[0]._id), (err, data) => {
                    // gfs.delete({ filename: req.params.id }, (err, data) => {
                    if (err) {
                        console.log("couldn't delete")
                        return res.status(404).json({ err: err });
                    }
                    console.log("successfully deleted")
                    res.status(200).json({
                        success: true,
                        message: `File with ID ${req.params.id} is deleted`,
                    });
                });
            });

        });

    return imageRouter;
};