let scan = document.getElementById('scanner')

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
        scan.srcObject = stream;
        scan.play();
    })
}

let scan_canvas = document.getElementById('scan-canvas');
let scan_context = scan_canvas.getContext('2d')   


// CSRF TOKEN
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
csrf_token = getCookie('csrftoken')

function search_vehicle(){
    scan_context.drawImage(scan,0,0)

    let url = 'http://127.0.0.1:8000/api/search-vehicle'
    const base64Canvas = scan_canvas.toDataURL("image/png");

    fetch(url,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrf_token
        },
        body:JSON.stringify({
            'img':base64Canvas
        })
    })
    .then((resp)=>resp.json())
    .then((data)=>{
        document.getElementById('close-img').click()
        let member = document.getElementById('mem-data-wrapper')
        member.innerHTML = ''
        if(data['type']!='unknown'){

            let vehicle_type = '🚗'
            if(!data.four_wheeler){
                vehicle_type = '🏍️'
            }
            let mem = `
            <div class="text-center mem-data p-3 m-3 col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <h4>Owner name</h4>
                <p>${data.owner} (${data.type})</p>
            </div>
            <div class="text-center mem-data p-3 m-3 col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <h4>Vehicle Number </h4>
                <p>${data.car_number} ${vehicle_type}</p>
            </div>
            <div class="text-center mem-data p-3 m-3 col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <h4>Phone Number</h4>
                <a href="tel:${data.phone_number}">
                    <p>📞 ${data.phone_number}</p>    
                </a>
            </div>
            
            `
            if(data['type']=='Member'){
                mem += `
                <div class="text-center mem-data p-3 m-3 col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <h4>Email ID</h4>
                <a href="mailto:${data.email_id}">
                    <p>📧 ${data.email_id}</p>    
                </a>
            </div>
                <div class="text-center mem-data p-3 m-3 col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
                <h4>Flat Number</h4>
                    <p>${data.flat_address}</p>    
                </div>
                `
            }else{
                mem += `
                <div class="text-center mem-data p-3 m-3 col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                    <h4>Purpose</h4>
                    <p>${data.purpose}</p>    
                </div>
                `
            }
            member.innerHTML = mem
        }else{
            member.innerHTML ='⚠️ Unknown Vehicle ⚠️'
        }
        document.getElementById('show-vehicle').click()
    
    }
    )
}


document.getElementById('snap').addEventListener('click',search_vehicle)
