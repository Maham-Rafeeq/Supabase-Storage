import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

let project_url = "https://gdwzktkfuhpththerfnf.supabase.co";
let project_anonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3prdGtmdWhwdGh0aGVyZm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTgwNjUsImV4cCI6MjA4NjAzNDA2NX0.d1_p-ZccPJPNY-n_1DFwDOjBVYG5px_YIhqi7gUtSWA";

const supabase = createClient(project_url, project_anonkey);

// function to upload image on database "supabase backet"
async function uploadefile() {
    let fileinput = document.getElementById("userimg");
    let file = fileinput.files[0];
    if(!file) {
        alert('first Chose a file')
        return
    };
   let filePath = `${Date.now()}`;
   
  
    const { data, error } = await supabase
        .storage
        .from('Image-Database')
        .upload(filePath,file);
        if(error){
            console.log("something went wrong try again"+ error.message);
            
        }
       else {
            fileinput.value = ""; 
                }
        await showimage();
  }
 window.uploadefile = uploadefile;
// FETCH IMAGES FORM SUPABASE
async function showimage(){
    const {data,error} = await supabase.storage
    .from("Image-Database")
    .list("",{limit: 100})

    if(error){
        console.log(error.message);
        
    }
    let container =document.getElementById("img-container");
    container.innerHTML = "";

 data.forEach(file => {
    if(file.name === ".emptyFolderPlaceholder") return;
    const {data} = supabase.storage
    .from("Image-Database") 
     .getPublicUrl(file.name); 
    container.innerHTML+=`
    <div class="card col-12 col-sm-8 col-md-6 col-lg-3 h-50"  style="width: 18rem;" >
  <img src="${data.publicUrl}?t=${Date.now()}" class="card-img-top"  alt="image"  style="width:100%; height: 300px; object-fit: cover;">
  <div class="card-body">
    <h5 class="card-title">${file.name}</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <button onclick="Deleteimg('${file.name}')" class="px-2 py-1 fs-16 border border-white bg-primary rounded-2 text-white ">Delete</button>
    <button onclick="updateimg('${file.name}')" class="px-2 py-1 fs-16 border border-white bg-primary rounded-2 text-white ">Update</button>
    <button 
    lo onclick="rename('${file.name}')" class="px-2 py-1 fs-16 border border-white bg-primary rounded-2 text-white ">Rename</button>
  </div>
</div>
  `
 });

}
window.showimage = showimage;
showimage();
// DELETE PROFILE CARD
async function Deleteimg(filename){
    const {error} = await supabase.storage
    .from("Image-Database")
    .remove([filename]); 
    if(error){
        console.log("deleted");
        
    }
  await showimage()
}
window.Deleteimg =Deleteimg;

// UPDATE PROFILE

function updateimg(oldFileName) {
   let model= document.getElementById("model");
    model.classList.remove('d-none');
    model.classList.add('d-flex');
    window.cancelupdate =function(){
      let model= document.getElementById("model");
    model.classList.remove('d-flex');
    model.classList.add('d-none');  
    }
    window.saveupdate =async function(){
let updateInput = document.getElementById("updateInput");
    let file = updateInput.files[0];
        console.log(file);
        if (!file) {
            alert("Select a profile")
            return;
        }
        
        const { error } = await supabase
            .storage
            .from('Image-Database')
            .update(oldFileName, file, { upsert: true });

        if (error) {
            console.log("Error: " + error.message);
        } else {
                alert("succesfully updated")
            updateInput.value = "";
            await showimage(); 
              let model= document.getElementById("model");
    model.classList.remove('d-flex');
    model.classList.add('d-none');  
        }
    }


    
    
}


window.updateimg = updateimg;
function rename(filename) {
    console.log("helo");
    
      let model= document.getElementById("rename-model");
    model.classList.remove('d-none');
    model.classList.add('d-flex');
    window.cancelupdate =function(){
      let model= document.getElementById("rename-model");
    model.classList.remove('d-flex');
    model.classList.add('d-none');  
    }
window.savepdate =async function(){
     let newName = document.getElementById("rename-input").value.trim();

        if (!newName) {
            alert("Fill Name");
            return;
        }

        const { error } = await supabase.storage
            .from('Image-Database')
            .move(filename, newName);  

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Renamed");
            model.classList.remove('d-flex');
            model.classList.add('d-none');
            document.getElementById("rename-input").value = '';
            await showimage();
        }
    }

}
    


window.rename= rename
