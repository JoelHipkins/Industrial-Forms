<?php

# Author: Jarrod Oberto
# Enhancer:  J.Straczynski

class ImageResize{
	
	private $image;
	private $width;
	private $height;
	private $imageResized;
	private $originalPath;

	function __construct($fileName=""){
		if(($fileName!="") && (is_file($fileName) || (strpos($fileName,"//")!==false))){
			$this->originalPath = $fileName;
			$this->image = $this->openImage($fileName);
			$this->width  = imagesx($this->image);
			$this->height = imagesy($this->image);
		}
	}

	private function openImage($file){
		$okext = array('.jpg','.jpeg','.gif','.png');
		$extension = strtolower(strrchr($file, '.'));
		if(empty($extension) || !in_array($extension,$okext)){
			$imdata = getimagesize($file);
			$extension = str_replace( array('image/gif', 'image/jpeg', 'image/png'), array('.gif','.jpg','.png'), $imdata['mime']);
		}
		switch($extension){
			case '.jpg':
			case '.jpeg':
				$img = @imagecreatefromjpeg($file);
			break;

			case '.gif':
				$img = @imagecreatefromgif($file);
			break;

			case '.png':
				$img = @imagecreatefrompng($file);
			break;

			default:
				$img = false;
			break;
		}
		return $img;
	}

	public function resizeImage($newWidth, $newHeight, $option="auto"){
		$optionArray = $this->getDimensions($newWidth, $newHeight, $option);

		$optimalWidth  = $optionArray['optimalWidth'];
		$optimalHeight = $optionArray['optimalHeight'];

		$this->imageResized = imagecreatetruecolor($optimalWidth, $optimalHeight);
		imagecopyresampled($this->imageResized, $this->image, 0, 0, 0, 0, $optimalWidth, $optimalHeight, $this->width, $this->height);

		if ($option == 'crop') {
			$this->crop($optimalWidth, $optimalHeight, $newWidth, $newHeight);
		}
	}

	private function getDimensions($newWidth, $newHeight, $option){
		switch ($option){
			case 'exact':
				$optimalWidth = $newWidth;
				$optimalHeight= $newHeight;
			break;

			case 'portrait':
				$optimalWidth = $this->getSizeByFixedHeight($newHeight);
				$optimalHeight= $newHeight;
			break;

			case 'landscape':
				$optimalWidth = $newWidth;
				$optimalHeight= $this->getSizeByFixedWidth($newWidth);
			break;

			case 'auto':
				$optionArray = $this->getSizeByAuto($newWidth, $newHeight);
				$optimalWidth = $optionArray['optimalWidth'];
				$optimalHeight = $optionArray['optimalHeight'];
			break;

			case 'fixed':
				if($this->width > $this->height){
					$optimalWidth = $newWidth;
					$optimalHeight= $this->getSizeByFixedWidth($newWidth);
				} else {
					$optimalWidth = $this->getSizeByFixedHeight($newHeight);
					$optimalHeight= $newHeight;            
				}
			break;  

			case 'minimum':
				if($this->width < $this->height){
					$optimalWidth = $newWidth;
					$optimalHeight= $this->getSizeByFixedWidth($newWidth);
				} else {
					$optimalWidth = $this->getSizeByFixedHeight($newHeight);
					$optimalHeight= $newHeight;            
				}
			break;  

			case 'box':
				$optionArray = $this->getSizeByAuto($newWidth, $newHeight);
				$optimalWidth = $optionArray['optimalWidth'];
				$optimalHeight = $optionArray['optimalHeight'];
				// fixed: too wide?
				if($optimalWidth > $newWidth){
					$optimalWidth = $newWidth;
					$optimalHeight= $this->getSizeByFixedWidth($newWidth);              
				}
				// fixed: too high?
				if($optimalHeight > $newHeight){
					$optimalWidth = $this->getSizeByFixedHeight($newHeight);
					$optimalHeight= $newHeight;            
				}
			break; 

			case 'crop':
				$optionArray = $this->getOptimalCrop($newWidth, $newHeight);
				$optimalWidth = $optionArray['optimalWidth'];
				$optimalHeight = $optionArray['optimalHeight'];
			break;
		}
		return array('optimalWidth' => $optimalWidth, 'optimalHeight' => $optimalHeight);
	}

	private function getSizeByFixedHeight($newHeight){
		$ratio = $this->width / $this->height;
		$newWidth = $newHeight * $ratio;
		return $newWidth;
	}

	private function getSizeByFixedWidth($newWidth){
		$ratio = $this->height / $this->width;
		$newHeight = $newWidth * $ratio;
		return $newHeight;
	}

	private function getSizeByAuto($newWidth, $newHeight){
		if ($this->height < $this->width){
			$optimalWidth = $newWidth;
			$optimalHeight= $this->getSizeByFixedWidth($newWidth);
		}elseif ($this->height > $this->width){
			$optimalWidth = $this->getSizeByFixedHeight($newHeight);
			$optimalHeight= $newHeight;
		}else{
			if ($newHeight < $newWidth) {
				$optimalWidth = $newWidth;
				$optimalHeight= $this->getSizeByFixedWidth($newWidth);
			} else if ($newHeight > $newWidth) {
				$optimalWidth = $this->getSizeByFixedHeight($newHeight);
				$optimalHeight= $newHeight;
			} else {
				$optimalWidth = $newWidth;
				$optimalHeight= $newHeight;
			}
		}
		return array('optimalWidth' => $optimalWidth, 'optimalHeight' => $optimalHeight);
	}

	private function getOptimalCrop($newWidth, $newHeight){

		$heightRatio = $this->height / $newHeight;
		$widthRatio  = $this->width /  $newWidth;

		if ($heightRatio < $widthRatio) {
			$optimalRatio = $heightRatio;
		} else {
			$optimalRatio = $widthRatio;
		}

		$optimalHeight = $this->height / $optimalRatio;
		$optimalWidth  = $this->width  / $optimalRatio;

		return array('optimalWidth' => $optimalWidth, 'optimalHeight' => $optimalHeight);
	}

	private function crop($optimalWidth, $optimalHeight, $newWidth, $newHeight){
		$cropStartX = ( $optimalWidth / 2) - ( $newWidth /2 );
		$cropStartY = ( $optimalHeight/ 2) - ( $newHeight/2 );

		$crop = $this->imageResized;
		$this->imageResized = imagecreatetruecolor($newWidth , $newHeight);
		imagecopyresampled($this->imageResized, $crop , 0, 0, $cropStartX, $cropStartY, $newWidth, $newHeight , $newWidth, $newHeight);
	}

	public function saveImage($savePath, $imageQuality="100"){
		$extension = strrchr($savePath, '.');
		$extension = strtolower($extension);

		switch($extension){
			case '.jpg':
			case '.jpeg':
				if (imagetypes() & IMG_JPG) {
					imagejpeg($this->imageResized, $savePath, $imageQuality);
				}
			break;

			case '.gif':
				if (imagetypes() & IMG_GIF) {
					imagegif($this->imageResized, $savePath);
				}
			break;

			case '.png':
				$scaleQuality = round(($imageQuality/100) * 9);
				$invertScaleQuality = 9 - $scaleQuality;
				if (imagetypes() & IMG_PNG) {
					imagepng($this->imageResized, $savePath, $invertScaleQuality);
				}
			break;

			default:
				imagejpeg($this->imageResized, $savePath, $imageQuality);
			break;
		}

		imagedestroy($this->imageResized);
	}

	public function watermarkBR($newPath, $waterPath="watermark.png"){    
		$original  = new Imagick($newPath);
		$watermark = new Imagick($waterPath);
		$original->compositeImage($watermark, $watermark->getImageCompose(), abs($original->getImageWidth()-$watermark->getImageWidth()-10), abs($original->getImageHeight()-$watermark->getImageHeight()-10)); 
		$original->writeImage($newPath);      
		$original->clear();
		$original->destroy();
		$watermark->clear();
		$watermark->destroy();
	}        

}

