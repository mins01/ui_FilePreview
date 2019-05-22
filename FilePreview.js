var FilePreview  = (function(){
	var FilePreview = {}
	var prt = FilePreview;
	prt.init = function(){
		
	}
	prt.observe = function(target,previewBox){
		
	}
	prt.createImage = function(event,file){
		var div = document.createElement('div');
		div.classList.add('preview-box')
		div.setAttribute('data-type',file.type);
		div.setAttribute('data-size',file.size);
		div.setAttribute('data-name',file.name);

		var img = new Image();
		img.src = event.target.result;
		img.onload = function(){
			div.setAttribute('data-naturalWidth',this.naturalWidth);
			div.setAttribute('data-naturalHeight',this.naturalHeight);
		}
		div.appendChild(img)
		return div;
	}
	prt.createPreview = function(src,file){
		var div = prt.createLabel(file);

		var prvObj = null;
		if(file.type.indexOf('image')===0){
			prvObj = new Image();
			prvObj.src = src;
			prvObj.onload = function(){
				div.setAttribute('data-naturalWidth',this.naturalWidth);
				div.setAttribute('data-naturalHeight',this.naturalHeight);
			}
		}else if(file.type.indexOf('audio')===0){
			prvObj = document.createElement('audio')
			prvObj.preload = 'none';
			prvObj.autoplay = false;
			prvObj.controls = true;
			prvObj.src = src;
		}else if(file.type.indexOf('video')===0){
			prvObj = document.createElement('video')
			prvObj.preload = 'none';
			prvObj.autoplay = false;
			prvObj.controls = true;
			prvObj.src = src;
		}
		prvObj.classList.add('preview-element')
		div.appendChild(prvObj)	
		
		return div;
	}
	prt.createLabel = function(file){
		var div = document.createElement('div');
		div.classList.add('preview-box')
		div.setAttribute('data-type',file.type);
		div.setAttribute('data-size',file.size);
		div.setAttribute('data-name',file.name);
		// div.innerText = file.name;
		return div;
	}
	prt.fileReader = function(file,cb){
		var fileReader = new FileReader();
			fileReader.onload = function (event) {
				cb(event,file);
			};
			fileReader.readAsDataURL(file);
	}
	prt.onchange = function(event,preview){
		if(event.target.files.length == 0){ //파일 업로드가 있을 경우만
			return;
		}
		
		var blobUrls = preview.querySelectorAll('[src^="blob:"]');
		for(var i=0,m=blobUrls.length;i<m;i++){
			URL.revokeObjectURL(blobUrls[i].src) //blob Url revoke
			console.log("revoke Blob url",blobUrls[i].src);
		}
		preview.innerHTML = '';
		for(var i=0,m=event.target.files.length;i<m;i++){ //다중 셀렉트 가능.
			var file = event.target.files[i];
			console.log(file.type,file.size,file)
			if(/(^image|^audio|^video)/.test(file.type)){ //이미지인 경우 미리보기 지원
				// @deprecated instead of URL.createObjectURL
				// prt.fileReader(file,function(event){
				// 		preview.appendChild(prt.createPreview(event.target.result,file));
				// })
				var src = URL.createObjectURL(file);
				console.log("create Blob url",src);
				preview.appendChild(prt.createPreview(src,file));
			}else{
				preview.appendChild(prt.createLabel(file));
			}
		}		
	}
	return FilePreview;
})()