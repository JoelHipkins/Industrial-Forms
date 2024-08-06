<?php

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('P3P:CP="IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT"');
	header('Content-Type: application/json; charset=utf-8');

	session_start();

	$request = json_decode(file_get_contents('php://input'), true);
	if(!count($request)){
		$request = @(array)json_decode($_REQUEST['data'], true);
	}

	//var_dump($request);

	function clearInput($input){
		if (gettype($input) == "string")
			return htmlspecialchars($input, ENT_QUOTES,'UTF-8');

		if (gettype($input) == "array"){
			foreach ($input as &$value){
				$value = clearInput($value); 
			}
		}

		return $input;
	}

	$request = clearInput($request);

	$data['type'] = $request['type'];
	$data['session_id'] = session_id();
	$data['error'] = null;
	$data['logged'] = false;
	$data['result'] = null;


	switch($request['type']) {
		case "checkLogin":
			if ((isset($_SESSION['logged'])) && ($_SESSION['logged']==true))
			{
				$data['logged'] = true;
			} else {
				$data['logged'] = false;
			}
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "login":
			require_once("modules/login.php");
			$login = new login($request['params']);
			$data['logged'] = $login->status;
			$data['error'] = $login->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "logout":
			require_once("modules/logout.php");
			$logout = new logout();
			$data['logged'] = $logout->status;
			$data['error'] = $logout->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "publish":
			require_once("modules/publish.php");
			$publish = new publish();
			$data['result'] = null;
			$data['error'] = $publish->error;
			$result = $publish->result;
			file_put_contents('upload/data.json', htmlspecialchars_decode(json_encode($result)));
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "moveUp":
			require_once("modules/moveUp.php");
			$moveUp = new moveUp($request['params']);
			$data['result'] = $moveUp->result;
			$data['logged'] = $moveUp->status;
			$data['error'] = $moveUp->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "moveDown":
			require_once("modules/moveDown.php");
			$moveDown = new moveDown($request['params']);
			$data['result'] = $moveDown->result;
			$data['logged'] = $moveDown->status;
			$data['error'] = $moveDown->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "userData":
			require_once("modules/checkLogin.php");
			$check = new checkLogin();
			if ($check->status) {
				require_once("modules/user.php");
				$user = new userData();
				$data['result'] = $user->result;
				$data['logged'] = true;
				print_r(htmlspecialchars_decode(json_encode($data)));
				die();
			} else {
				$data['logged'] = false;
				$data['error'] = "Zaloguj się!";
				print_r(htmlspecialchars_decode(json_encode($data)));
				die();
			}
		break;

		case "updateUserData":
			require_once("modules/updateUserData.php");
			$update = new updateData($request['params']);
			$data['logged'] = true;
			$data['error'] = $update->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "updateUserPassword":
			require_once("modules/updateUserPassword.php");
			$update = new updatePassword($request['params']);
			$data['logged'] = true;
			$data['error'] = $update->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "delete":
			require_once("modules/delete.php");
			$delete = new delete($request['params']);
			$data['result'] = $delete->result;
			$data['logged'] = $delete->status;;
			$data['error'] = $delete->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "getGallery":
			require_once("modules/getGallery.php");
			$getGallery = new getGallery($request['params']);
			$data['result'] = $getGallery->result;
			$data['logged'] = true;
			$data['error'] = $getGallery->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "updateGallery":
			require_once("modules/updateGallery.php");
			$updateGallery = new updateGallery($request['params']);
			$data['result'] = $updateGallery->result;
			$data['logged'] = $updateGallery->status;
			$data['error'] = $updateGallery->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;
		
		case "addGallery":
			require_once("modules/addGallery.php");
			$addGallery = new addGallery($request['params']);
			$data['result'] = $addGallery->result;
			$data['logged'] = $addGallery->status;
			$data['error'] = $addGallery->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "getCategories":
			require_once("modules/getCategories.php");
			$getCategories = new getCategories($request['params']);
			$data['result'] = $getCategories->result;
			$data['logged'] = true;
			$data['error'] = $getCategories->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "updateCategories":
			require_once("modules/updateCategories.php");
			$updateCategories = new updateCategories($request['params']);
			$data['result'] = $updateCategories->result;
			$data['logged'] = $updateCategories->status;
			$data['error'] = $updateCategories->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;
		
		case "addCategories":
			require_once("modules/addCategories.php");
			$addCategories = new addCategories($request['params']);
			$data['result'] = $addCategories->result;
			$data['logged'] = $addCategories->status;
			$data['error'] = $addCategories->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "getProducts":
			require_once("modules/getProducts.php");
			$getProducts = new getProducts($request['params']);
			$data['result'] = $getProducts->result;
			$data['logged'] = true;
			$data['error'] = $getProducts->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "updateProducts":
			require_once("modules/updateProducts.php");
			$updateProducts = new updateProducts($request['params']);
			$data['result'] = $updateProducts->result;
			$data['logged'] = $updateProducts->status;
			$data['error'] = $updateProducts->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;
		
		case "addProducts":
			require_once("modules/addProducts.php");
			$addProducts = new addProducts($request['params']);
			$data['result'] = $addProducts->result;
			$data['logged'] = true;
			$data['status'] = $addProducts->status;
			$data['error'] = $addProducts->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "getImages":
			require_once("modules/getImages.php");
			$getImages = new getImages($request['params']);
			$data['result'] = $getImages->result;
			$data['logged'] = true;
			$data['error'] = $getImages->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;
		
		case "addImages":
			require_once("modules/addImages.php");
			$addImages = new addImages($request['params']);
			$data['result'] = $addImages->result;
			$data['logged'] = true;
			$data['error'] = $addImages->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;
		
		case "addImagesProducts":
			require_once("modules/addImagesProducts.php");
			$addImagesProducts = new addImagesProducts($request['params']);
			$data['result'] = $addImagesProducts->result;
			$data['logged'] = $addImagesProducts->status;
			$data['error'] = $addImagesProducts->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "getTodos":
			require_once("modules/getTodos.php");
			$getTodos = new getTodos($request['params']);
			$data['result'] = $getTodos->result;
			$data['logged'] = true;
			$data['error'] = $getTodos->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;

		case "addTodos":
			require_once("modules/addTodos.php");
			$addTodos = new addTodos($request['params']);
			$data['result'] = $addTodos->result;
			$data['logged'] = $addTodos->status;
			$data['error'] = $addTodos->error;
			print_r(htmlspecialchars_decode(json_encode($data)));
			die();
		break;
	}

?>