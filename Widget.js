define([
  'dojo/_base/declare', 
  'jimu/BaseWidget', 
  "dojo/_base/lang", 
  "dojo/on"],
function(
  declare, 
  BaseWidget, 
  lang, 
  on
) {
  return declare([BaseWidget], {

    baseClass: 'sending-file',

    postCreate: function() {
      this.inherited(arguments);

      this.own(on(this.fileNode,"change", lang.hitch(this, function(){
          this.validation()
        }
      )));

      this.own(on(this.uploadLabel,"click", lang.hitch(this,function(event){
        event.preventDefault();
        this.onsubmit()
      })));

      console.log('SendingFile::postCreate');
    },

    onsubmit: function() {
      var url= this.config.serviceUrl;

      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

      xhr.send(this.validateImage(this.readURL()));
      xhr.onreadystatechange = function(){
        if(xhr.readyState != 4) return;
        if(xhr.status != 200){
            alert("Status: " + xhr.status);
        }else{
            alert(xhr.responseText);
        }
      };
    },

    validation: function() {
      var img = this.fileNode.files[0]
      console.log(img.size)
      var allowedFiles = [".zip", ".rar"];
      var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$")
      if(!regex.test(img.name)){
        alert("Please upload files having extensions: <b>" + allowedFiles.join(', ') + "</b> only.")
        this.fileNode.value = '';
        return false;
      }
      var fsize = (img.size / 1024 / 1024).toFixed(2);  

      if (fsize > 2) {
        alert("Max Upload size is 2MB only")
        this.fileNode.value = '';
          return false;
      }
      return true
    },

    readURL: function() {
      var formdata = new FormData();

      if (this.fileNode.files && this.fileNode.files[0]) {
        var reader = new FileReader();
    
        reader.onload = function(e) {
          var file = e.target.result
          formdata.append('file', file);
          console.log(Array.from(formdata))
        }
        reader.readAsDataURL(this.fileNode.files[0]);
      }
      return formdata
    },
  });
});
