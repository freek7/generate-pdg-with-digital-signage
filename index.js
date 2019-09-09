
const wrapper = document.getElementById("signature-pad"),
  canvas = wrapper.querySelector("canvas");


signaturePad = new SignaturePad(canvas, {
  throttle: 16,
  backgroundColor: 'rgba(255, 255, 255, 0)',
  penColor: '#000',
});

const clearButton = document.getElementById('clear');

clearButton.addEventListener('click', function (event) {
  signaturePad.clear();
});

const signatureForm = document.getElementById('signature-form');

signatureForm.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!signaturePad.isEmpty() && this.elements['email'].value) {
    const signature = signaturePad.toDataURL('image/png');
    let formData = new FormData(signatureForm);
    formData.append('signature', signature);
   
    HTTP_post(signatureForm.action, formData).then(function(res){
      const data = JSON.parse(res);
    
      alert(data.message);
      if(data.status){
        window.open(data.pdf_url, '_blank', 'fullscreen=yes')
      }
    });

  } else {
    alert('not valid');
  }
});


function b64ToUint8Array(b64Image) {
  var img = atob(b64Image.split(',')[1]);
  var img_buffer = [];
  var i = 0;
  while (i < img.length) {
    img_buffer.push(img.charCodeAt(i));
    i++;
  }
  return new Blob([new Uint8Array(img_buffer)], { type: "image/png" });
}


function HTTP_post(url, data, headers={}) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    if (!!Object.keys(headers)) {
      for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
          const element = headers[key];
          xhr.setRequestHeader(key, element);
        }
      }
    }
    xhr.onreadystatechange = function () { 
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        resolve(this.response);
      }
    }

    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };

    xhr.send(data );

  });
}


function HTTP_get(url) {

  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };

    xhr.send();
  });

}