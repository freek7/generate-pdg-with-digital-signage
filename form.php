<?php
require 'vendor/autoload.php';
$response = [];
$email = $_POST['email'];
$name = $_POST['name'];
$uploaddir = './uploads/' . date('Y') . '/' . date('m') . '/' . date('d') . '/';
if (!file_exists($uploaddir)) {
  mkdir($uploaddir, 0777, true);
}
// $uploadfileURL = $uploaddir .  basename($email .   '.png');

// $signatureBlob =  file_get_contents($_FILES['signature']['tmp_name']);

// file_put_contents($uploadfileURL,  $signatureBlob);

use Dompdf\Dompdf;

ob_start(); ?>
<!DOCTYPE html>
<html>

<head>
  <meta charset='utf-8'>
  <style>
    body {
      font-size: 16px;
      color: black;
    }
  </style>
  <title>Title</title>
</head>

<body>
  <h2>Hello</h2>
  <table style="width:100%">
    <tr>
      <th>Name</th>
      <th>email</th>
    </tr>
    <tr>
      <td><?= $name; ?></td>
      <td><?= $email; ?></td>
    </tr>
  </table>
  <table>
    <tr>
      <td>signature</td>
      <td><img style="display:inline-block; max-width: 100px;" src="<?= $_POST['signature']; ?>"></td>
    </tr>
  </table>

</body>

</html>
<?php
$html = ob_get_clean();

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$pdf_gen = $dompdf->output();

if (!file_put_contents($uploaddir .  basename($email . '.pdf'), $pdf_gen)) {
  $response['status'] = false;
  $response['message'] = 'some was wrong';
} else {
  $response['status'] = true;
  $response['message'] = "pdf created by url " . $uploaddir .  basename($email . '.pdf');
  $response['pdf_url'] = $_SERVER["HTTP_REFERER"] . trim($uploaddir .  basename($email . '.pdf'), './');
}
header('Content-Type: application/json');
echo json_encode($response);
