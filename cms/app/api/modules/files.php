<?php

if (isset($_SESSION['logged']) && $_SESSION['logged'] == true ) {

	define('UPLOAD_DIR', 'upload/');
	function fileUpload($field_name='file'){
		$allowed     = array('pdf');
		$upload_dir  = UPLOAD_DIR;

		if(!is_dir($upload_dir)) 
			mkdir($upload_dir, 0777, true);

		if(isset($_FILES[$field_name]) && $_FILES[$field_name]['error'] == 0){
			$extension = pathinfo($_FILES[$field_name]['name'], PATHINFO_EXTENSION);

			if(!in_array(strtolower($extension), $allowed)){
				return array("status" => false,  "error" => "wrong file extension");
			}

			$name = $_FILES[$field_name]['name'];
			$uploaded_filename = sprintf('%s', $name);

			if(move_uploaded_file($_FILES[$field_name]['tmp_name'], "{$upload_dir}/{$uploaded_filename}")){
				$file = "{$upload_dir}/{$uploaded_filename}";
					
				return array("status" => true, "file" => '/api/upload/'.$uploaded_filename, "error" => null);
			}

			return array("status" => false, "error" => "error during upload"); 
		}
		return array("status" => false, "error" => "empty upload"); 
	}

} 

?>