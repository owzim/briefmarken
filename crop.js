(function(imgPath) {

	var sizeOf = require('image-size'),
		fs = require('fs.extra'),
		exec = require('child_process').exec,
		im = require('imagemagick'),
		vsprintf = require("sprintf-js").vsprintf;


	var outputDir = './output';

	var refImageW = 2479;
	var refImageH = 3508;

	var refCropX = 590;
	var refCropY = 440;
	var refCropW = 450;
	var refCropH = 160;

	var refCropStepX = 1063;
	var refCropStepY = 555;

	var columns = 2;
	var rows = 5;

	if (fs.existsSync(outputDir)) {
		fs.rmrfSync(outputDir);
	}
	fs.mkdirSync(outputDir);

	var img = sizeOf(imgPath);
	var ext = imgPath.split('.');
	ext = ext[ext.length-1];
	var imgPathWOExt = imgPath.replace('.' + ext, '');

	var relX = Math.round(img.width / (refImageW / refCropX));
	var relY = Math.round(img.height / (refImageH / refCropY));
	var relW = Math.round(img.width / (refImageW / refCropW));
	var relH = Math.round(img.height / (refImageH / refCropH));

	var relCropStepX = Math.round(img.width / (refImageW / refCropStepX));
	var relCropStepY = Math.round(img.height / (refImageH / refCropStepY));


	var counter = 0,
		currY, currX,
		outputImgPath, crop,
		i, j;

	for(i = 0; i < rows; i++ ) {
		currY = relY + (relCropStepY * i);

		for(j = 0; j < columns; j++ ) {
			currX = relX + (relCropStepX * j);

			outputImgPath = vsprintf('%s/%s_%s.%s', [outputDir, imgPathWOExt, ++counter, ext]);
			crop = vsprintf('%sx%s+%s+%s', [relW, relH, currX, currY]);

			im.convert([imgPath, '-crop', crop, outputImgPath],
				function(err, stdout){
					if (err) throw err;
				}
			);
		}
	}
})(process.argv[2]);