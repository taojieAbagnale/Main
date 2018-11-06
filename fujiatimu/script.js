

onload = function(){
     
    var c = document.getElementById('canvas');
    let crateTexture;
    let moonTexture;
    let ibo;
    let temp=false;
    let tempT=false;
    let tempU=false;
    c.width = 500;
    c.height = 300;


    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');


    var v_shader = create_shader('vs');
    var f_shader = create_shader('fs');
     

    var prg = create_program(v_shader, f_shader);


    var attLocation = new Array();
    attLocation[0] = gl.getAttribLocation(prg, 'position');//position得到地址
    attLocation[1] = gl.getAttribLocation(prg, 'color');//color得到纹理地址
     let u_Sampler = gl.getUniformLocation(prg, 'u_Sampler');//得到usamper地址


    var attStride = new Array();
    attStride[0] = 3;//坐标幅度为3
    attStride[1] = 2;//纹理幅度为2

    var torusData =  sphere(64, 64, 2.0);
    var position = torusData[0];
    var color = torusData[1];//纹理数组
    var index = torusData[2];//取得索引数组
    

      //做一个流星
    var torusData2 =  sphere(64, 64, 0.5);
    var position2 = torusData2[0];
    var color2 = torusData2[1];//纹理数组
    var index2 = torusData2[2];//取得索引数组
    
    

  
   
    var pos_vbo = create_vbo(position);//将数据写入vbo
    var col_vbo = create_vbo(color);
//做一个流星    
  var pos_vbo2 = create_vbo(position2);//将数据写入vbo
    var col_vbo2 = create_vbo(color2);


    var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');//取得mvpMatrix对象


    var m = new matIV();


    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());


    m.lookAt([0.0, 0.0, 10.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);


    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
     
           //载入图片
       initTextures(gl);
   
   
    var count = 0;
    var count1= 0;
    
     (function(){

        count++;
        count1++;
     
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



       set_attribute([pos_vbo, col_vbo], attLocation, attStride);//将vbo中的数据给得到的地址


        ibo = create_ibo(index);//将数据写入ibo
    

       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);//将ibo绑定gl.ElEmnet_arrry_buffer 对象
     


        var rad = (count % 360) * Math.PI / 180;
        var rad = (count % 360) * Math.PI / 180;
         gl.bindTexture(gl.TEXTURE_2D,null);
        gl.activeTexture(gl.TEXTURE0);
        
        gl.bindTexture(gl.TEXTURE_2D, crateTexture);
       
       
        gl.uniform1i(u_Sampler, 0);








        m.identity(mMatrix);
        if(temp){
        
         m.rotate(mMatrix, rad, [-0.2, 1, 0], mMatrix);//绕着这个向量进行旋转
}
       
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);//调用gl.element_array_buffer

		m.identity(mMatrix);
		m.scale(mMatrix,[0.3,0.3,0.3],mMatrix);
		if(tempT){
		m.translate(mMatrix,[10*Math.cos(rad),0,10*Math.sin(rad)],mMatrix);
		}
       if(tempU){m.rotate(mMatrix, rad, [-0.2, 1, 0], mMatrix);}//自转
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        
       
       
        set_attribute([pos_vbo2, col_vbo2], attLocation, attStride);//将vbo中的数据给得到的地址
        ibo = create_ibo(index);//将数据写入ibo
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);//将ibo绑定gl.ElEmnet_arrry_buffer 对象
      
        m.identity(mMatrix);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, moonTexture);
        gl.uniform1i(u_Sampler, 0);
      if(tempT){
        m.translate(mMatrix,[8*Math.cos(rad),0,8*Math.sin(rad)],mMatrix);
       }
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);





        
        gl.flush();


        setTimeout(arguments.callee, 1000 / 30);
    })();


    function create_shader(id){

        var shader;


        var scriptElement = document.getElementById(id);


        if(!scriptElement){return;}


        switch(scriptElement.type){


            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;


            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }


        gl.shaderSource(shader, scriptElement.text);


        gl.compileShader(shader);


        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){


            return shader;
        }else{


            alert(gl.getShaderInfoLog(shader));
        }
    }


    function create_program(vs, fs){

        var program = gl.createProgram();


        gl.attachShader(program, vs);
        gl.attachShader(program, fs);


        gl.linkProgram(program);


        if(gl.getProgramParameter(program, gl.LINK_STATUS)){


            gl.useProgram(program);


            return program;
        }else{


            alert(gl.getProgramInfoLog(program));
        }
    }


    function create_vbo(data){

        var vbo = gl.createBuffer();


        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);


        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);


        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        return vbo;
    }


    function set_attribute(vbo, attL, attS){

        for(var i in vbo){

            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);


            gl.enableVertexAttribArray(attL[i]);


            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }


    function create_ibo(data){

        var ibo = gl.createBuffer();


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);


        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


        return ibo;
    }

 
  function initTextures (gl) {

    
        moonTexture = gl.createTexture();
        moonTexture.image = new Image();
        moonTexture.image.onload = function () {
            handleLoadedTexture(moonTexture)
        }
        moonTexture.image.src = "i2.jpg";

        crateTexture = gl.createTexture();
        crateTexture.image = new Image();
        crateTexture.image.onload = function () {
            handleLoadedTexture(crateTexture)
        }
        crateTexture.image.src = "i1.jpg";
  }

    function handleLoadedTexture(texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }



   function sphere(row, column, rad){
            var pos = new Array(),
            col = new Array(), idx = new Array();
        for(var i = 0; i <= row; i++){
            var r = Math.PI / row * i;
            var ry = Math.cos(r);
            var rr = Math.sin(r);
            for(var ii = 0; ii <= column; ii++){
                var tr = Math.PI * 2 / column * ii;
                var tx = rr * rad * Math.cos(tr);
                var ty = ry * rad;
                var tz = rr * rad * Math.sin(tr);
                pos.push(tx, ty, tz);
                col.push(i/row);
                col.push(ii/column);
            }
        }
        r = 0;
        for(i = 0; i < row; i++){
            for(ii = 0; ii < column; ii++){
                r = (column + 1) * i + ii;
                idx.push(r, r + 1, r + column + 2);
                idx.push(r, r + column + 2, r + column + 1);
            }
        }

        return [pos, col, idx];
    }
    document.onkeydown=function(event){
    	var e = event || window.event || arguments.callee.caller.arguments[0];
                  if(e && e.keyCode==32){
                  	if(temp){
                  		temp=false;
                  	}else{
                  		temp=true;
					}
		}
                  if(e && e.keyCode==84){
                      if(tempT){
                          tempT=false;
                      }else{
                          tempT=true;
                      }
		}
        if(e && e.keyCode==85){
            if(tempU){
                tempU=false;
            }else{
                tempU=true;
            }
        }

               };

};

