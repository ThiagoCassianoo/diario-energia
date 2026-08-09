import * as THREE from 'three';
let scene,camera,renderer,points,lines,group,animId,entriesData=[];
let mouse=new THREE.Vector2(),targetRotation=new THREE.Vector2(),dragStart=null,dragRotStart=null;
const COLORS={low:new THREE.Color('#B8615A'),mid:new THREE.Color('#8FA9C7'),high:new THREE.Color('#D4A24E')};
export function initConstellation(containerId){
  const container=document.getElementById(containerId);if(!container)return;
  const w=container.clientWidth,h=container.clientHeight;
  scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x030508,0.04);
  camera=new THREE.PerspectiveCamera(60,w/h,0.1,100);camera.position.z=9;
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(w,h);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x000000,0);container.innerHTML='';container.appendChild(renderer.domElement);
  group=new THREE.Group();scene.add(group);
  const starGeo=new THREE.BufferGeometry(),starCount=500,starPos=new Float32Array(starCount*3);
  for(let i=0;i<starCount*3;i++)starPos[i]=(Math.random()-0.5)*35;
  starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  const starMat=new THREE.PointsMaterial({color:0xffffff,size:0.018,transparent:true,opacity:0.25});
  scene.add(new THREE.Points(starGeo,starMat));
  container.addEventListener('mousemove',(e)=>{const rect=container.getBoundingClientRect();mouse.x=((e.clientX-rect.left)/rect.width)*2-1;mouse.y=-((e.clientY-rect.top)/rect.height)*2+1});
  container.addEventListener('mousedown',(e)=>{dragStart={x:e.clientX,y:e.clientY};dragRotStart={x:group.rotation.x,y:group.rotation.y};container.style.cursor='grabbing'});
  container.addEventListener('mousemove',(e)=>{if(!dragStart)return;const rect=container.getBoundingClientRect();const dx=(e.clientX-dragStart.x)/rect.width*3;const dy=(e.clientY-dragStart.y)/rect.height*3;group.rotation.y=dragRotStart.y+dx;group.rotation.x=dragRotStart.x-dy});
  container.addEventListener('mouseup',()=>{dragStart=null;container.style.cursor='grab'});
  container.addEventListener('mouseleave',()=>{dragStart=null;container.style.cursor='grab'});
  window.addEventListener('resize',()=>{if(!container)return;const nw=container.clientWidth,nh=container.clientHeight;camera.aspect=nw/nh;camera.updateProjectionMatrix();renderer.setSize(nw,nh)});
  updateConstellation([]);animate();
}
export function updateConstellation(entries){
  entriesData=entries;
  while(group.children.length>0){const child=group.children[0];if(child.geometry)child.geometry.dispose();if(child.material)child.material.dispose();group.remove(child)}
  if(entries.length<2)return;
  const last=entries.slice(-24),positions=[],colors=[],sizes=[];
  last.forEach((e,i)=>{
    const t=i/(last.length-1),x=(t-0.5)*12,y=((e.fisica+e.mental)/2-3)*2,z=(e.humor-3)*1.5;
    positions.push(x,y,z);
    const score=(e.fisica+e.mental+e.humor)/3,c=score<2.5?COLORS.low:score<3.5?COLORS.mid:COLORS.high;
    colors.push(c.r,c.g,c.b);sizes.push(lerp(0.06,0.16,(e.humor-1)/4));
  });
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.setAttribute('size',new THREE.Float32BufferAttribute(sizes,1));
  const mat=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0}},
    vertexShader:`attribute float size;varying vec3 vColor;uniform float uTime;void main(){vColor=color;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);float pulse=1.0+0.25*sin(uTime*1.5+position.x*2.0);gl_PointSize=size*350.0*pulse/-mvPosition.z;gl_Position=projectionMatrix*mvPosition;}`,
    fragmentShader:`varying vec3 vColor;void main(){float dist=length(gl_PointCoord-vec2(0.5));if(dist>0.5)discard;float alpha=1.0-smoothstep(0.25,0.5,dist);gl_FragColor=vec4(vColor,alpha*0.95);}`,
    transparent:true,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false
  });
  points=new THREE.Points(geo,mat);group.add(points);
  if(last.length>=2){
    const linePositions=[],lineColors=[];
    for(let i=0;i<last.length-1;i++){
      const t1=i/(last.length-1),t2=(i+1)/(last.length-1);
      const x1=(t1-0.5)*12,y1=((last[i].fisica+last[i].mental)/2-3)*2,z1=(last[i].humor-3)*1.5;
      const x2=(t2-0.5)*12,y2=((last[i+1].fisica+last[i+1].mental)/2-3)*2,z2=(last[i+1].humor-3)*1.5;
      linePositions.push(x1,y1,z1,x2,y2,z2);
      const score=(last[i].fisica+last[i].mental+last[i].humor)/3,c=score<2.5?COLORS.low:score<3.5?COLORS.mid:COLORS.high;
      lineColors.push(c.r,c.g,c.b,c.r,c.g,c.b);
    }
    const lineGeo=new THREE.BufferGeometry();
    lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(linePositions,3));
    lineGeo.setAttribute('color',new THREE.Float32BufferAttribute(lineColors,3));
    const lineMat=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0.2,blending:THREE.AdditiveBlending});
    lines=new THREE.LineSegments(lineGeo,lineMat);group.add(lines);
  }
}
function lerp(a,b,t){return a+(b-a)*t}
function animate(){
  animId=requestAnimationFrame(animate);const time=performance.now()*0.001;
  if(points&&points.material.uniforms)points.material.uniforms.uTime.value=time;
  if(!dragStart){
    targetRotation.x=mouse.y*0.15;targetRotation.y=mouse.x*0.25;
    group.rotation.x+=(targetRotation.x-group.rotation.x)*0.015;
    group.rotation.y+=(targetRotation.y-group.rotation.y)*0.015;
    group.rotation.y+=0.0008;
  }
  renderer.render(scene,camera);
}
export function stopConstellation(){if(animId)cancelAnimationFrame(animId)}
