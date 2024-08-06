<?php

if (isset($_SESSION['logged']) && $_SESSION['logged'] == true ) {

	define('UPLOAD_DIR', 'upload/');
	function imageUpload($field_name){
		$allowed     = array('png', 'jpg', 'gif', 'jpeg');
		$upload_dir  = UPLOAD_DIR;

		if(!is_dir($upload_dir)) 
			mkdir($upload_dir, 0777, true);

		if(isset($_FILES[$field_name]) && $_FILES[$field_name]['error'] == 0){
			$extension = pathinfo($_FILES[$field_name]['name'], PATHINFO_EXTENSION);

			if(!in_array(strtolower($extension), $allowed)){
				return array("status" => false,  "error" => "wrong file extension");
			}

			$sha1 = sha1_file($_FILES[$field_name]['tmp_name']);
			$uploaded_filename = sprintf('%s.%s', $sha1 , $extension);
			$uploaded_original = sprintf('%s.orig.%s', $sha1 , $extension);
			$uploaded_thumb = sprintf('%s.thumb.%s', $sha1 , $extension);

			if(move_uploaded_file($_FILES[$field_name]['tmp_name'], "{$upload_dir}/{$uploaded_filename}")){
				$photo = "{$upload_dir}/{$uploaded_filename}";
				$thumb = "{$upload_dir}/{$uploaded_thumb}";
				$original = "{$upload_dir}/{$uploaded_original}";

				copy($photo, $original);
					
				$imres = new ImageResize($photo);

				$imres->resizeImage(350, 350, 'crop');
				$imres->saveImage($thumb);
					
				return array("status" => true, "photo" => '/api/upload/'.$uploaded_filename, "thumb" => '/api/upload/'.$uploaded_thumb, "error" => null);
			}

			return array("status" => false, "error" => "error during upload"); 
		}
		return array("status" => false, "error" => "empty upload"); 
	}

} 

?>