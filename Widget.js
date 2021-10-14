define([
  'dojo/_base/declare', 
  'jimu/BaseWidget', 
  "dojo/_base/lang", 
  "dojo/on",
],
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
        this.eventLogContents.value = this.fileNode.files[0].name
        this.uploadLabel.disabled = false
          this.readURL(function(content) {
            console.log(content)
          })
        }
      )));

      this.own(on(this.removeLabel,"click", lang.hitch(this, function(){
          this.eventLogContents.value = ""
          this.remove()
        }
      )));

      this.own(on(this.fileForm,"submit", lang.hitch(this, function(event){
        event.preventDefault();
        var file = event.target.file.files[0]
        this.onsubmit(file)
      })));
    },

    onsubmit: function(file) {
      var url= this.config.serviceUrl;
      var formdata = new FormData();
      formdata.append('file', file);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

      xhr.send(formdata);
      xhr.onreadystatechange = function(){
        if(xhr.readyState != 4) return;
        if(xhr.status != 200){
            alert("Status: " + xhr.status);
        }else{
            alert(xhr.responseText);
        }
      };
      this.fileForm.reset()
      this.uploadLabel.disabled = true
    },

    handleEvent: function(event) {
      if (event.type === "load") {
        alert(`${event.type}: ${event.loaded} bytes transferred\n`)
      }
    },

    addListeners: function(reader) {
        reader.addEventListener('loadstart', this.handleEvent);
        reader.addEventListener('load', this.handleEvent);
        reader.addEventListener('loadend', this.handleEvent);
        reader.addEventListener('progress', this.handleEvent);
        reader.addEventListener('error', this.handleEvent);
        reader.addEventListener('abort', this.handleEvent);
    },

    remove: function() {
      if(confirm("Deseja realmente excluir?")){
        this.fileForm.reset()
        this.uploadLabel.disabled = true
      }
    },

    readURL: function(cb) {
      var allowedExtensions = /(\.zip|\.rar)$/i;
      var fsize = (this.fileNode.files[0].size / 1024 / 1024).toFixed(2);

      if (!allowedExtensions.exec(this.fileNode.value)) {
        alert("Please upload files having extensions: <b> .zip or .rar </b> only.");
        this.fileNode.value = '';
        this.eventLogContents.value = '';
        this.uploadLabel.disabled = true
        return false;
      } 
      if (fsize > 2) {
        alert("Max Upload size is 2MB only.");
        this.fileNode.value = '';
        this.eventLogContents.value = '';
        this.uploadLabel.disabled = true
        return false;
      } 
      else 
      {
      if (this.fileNode.files && this.fileNode.files[0]) {
        var reader = new FileReader();
    
        reader.onload = function(e) {
          cb(e.target.result)
        }
          this.addListeners(reader);
          reader.readAsDataURL(this.fileNode.files[0]);
        }
      }
    },

    onClose: function(){
      this.fileForm.reset()
    },
  });
});
