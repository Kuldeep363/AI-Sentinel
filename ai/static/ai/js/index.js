
        let entry_video = document.getElementById('entry_video')
        let exit_video = document.getElementById('exit_video')

        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
            navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
                entry_video.srcObject = stream;
                entry_video.play();
                exit_video.srcObject = stream;
                exit_video.play();
            })
        }

        let entry_canvas = document.getElementById('entry-canvas');
        let entry_context = entry_canvas.getContext('2d')
        let exit_canvas = document.getElementById('exit-canvas');
        let exit_context = exit_canvas.getContext('2d')
        // let imageData;
        // function draw() {
        //     // document.getElementById('snap').addEventListener('click',()=>{
        //         context.drawImage(video,0,0)
        //         imageData = context.getImageData(0,0,640,480);
        //     // });
        // }
        document.getElementById('entry-alert-off').addEventListener('click',()=>{
            document.getElementById('entry-alert').style.display = 'none'
            document.getElementById('alert-sound').pause()
        })
        document.getElementById('exit-alert-off').addEventListener('click',()=>{
            document.getElementById('exit-alert').style.display = 'none'
            document.getElementById('alert-sound').pause()
        })

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

        vehicles_list = []

        // get vehicles data
        function get_vehicles_data(){
            let table = document.querySelector('#vehicles-data tbody');
            table.innerHTML = ''
            let url = 'http://127.0.0.1:8000/api/get-vehicles-data'

            fetch(url)
            .then((resp)=>resp.json())
            .then((data)=>{
                console.log('Data:',data)
                let list = data
                let sn = 0 
                let vehicle_type = '🚗'
                for(let i=0; i<list.length;i++){
                    // try{
                    //     document.getElementById(`data-row=${i}`).remove()
                    // }
                    // catch(err){

                    // }
                    console.log(list[i])
                    sn = i+1
                    vehicle_type = '🚗'
                    if(!list[i].four_wheeler){
                        vehicle_type = '🏍️'

                    }
                    let car = `
                        <tr id=" data-row-${i}" class="text-center member-vehicle-${list[i].member}">
                            <td>${sn}</td>
                            <td>${vehicle_type}</td>
                            <td>${list[i].car_number}</td>
                            <td>${list[i].owner}</td>
                            <td>${list[i].entry_date}</td>
                            <td>${list[i].entry_timing}</td>
                            <td>${list[i].exit_date}</td>
                            <td>${list[i].exit_timing}</td>
                            <td><a href="tel:${list[i].phone_number}">${list[i].phone_number}</a></td>
                        </tr>
                    `
                    table.innerHTML+=car;
                }

                if(vehicles_list.length > list.length){
                    for(let i=list.length;i<vehicles_list.length;i++){
                        document.getElementById(`data-row-${i}`).remove()
                    }
                }
                vehicles_list = list
            })
            
        }
        
        let car_number = ''

        // add member entry
        function add_members_entry(number){
            let url = 'http://127.0.0.1:8000/api/add-entry'

            
            fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'X-CSRFToken':csrf_token
                },
                body:JSON.stringify({
                    'number':number,
                })
            })
            .then((resp)=>resp.json())
            .then((data)=>{
                console.log(data['action'])
                document.getElementById('enter').click()
                document.getElementById('entry-msg').style.top = '10px'
                setTimeout(()=>{
                    document.getElementById('entry-msg').style.top = '-50px'
                },4000)
                get_vehicles_data()
            })
        }
        

        // get car number
        function get_car_number(){

            const base64Canvas = entry_canvas.toDataURL("image/png");
            let url = "http://127.0.0.1:8000/api/get-img"
            // console.log(base64Canvas)

            fetch(url,{
                method:'POST',
                headers:{
                    "Content-type":'application/json',
                    "X-CSRFToken":csrf_token
                },
                body:JSON.stringify({
                    'img':base64Canvas
                })
            })
            .then((resp)=>resp.json())
            .then((data)=>{
                console.log(data)
                if(!data['permission']){
                    console.log('visitors')
                    document.getElementById('enter').click()
                    document.getElementById('entry-alert').style.display='flex'
                    document.getElementById('alert-sound').play()
                    
                    document.getElementById('car-number').value = data['number']
                }
                else{
                    add_members_entry(data['number'])
                }
            })

        }

        // add visitors enrty
        function add_visitors_entry(){
            let url = 'http://127.0.0.1:8000/api/add-entry'

            let type = (document.querySelector('input[name="type"]:checked').value == 'true')
            
            fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'X-CSRFToken':csrf_token
                },
                body:JSON.stringify({
                    'number':document.getElementById('car-number').value,
                    name:document.getElementById('name').value,
                    phone:document.getElementById('phone').value,
                    purpose:document.getElementById('purpose').value,
                    type:type
                })
            })
            .then((resp)=>resp.json())
            .then((data)=>{
                console.log(data['action'])
                document.getElementById('entry-msg').style.top = '10px'
                setTimeout(()=>{
                    document.getElementById('entry-msg').style.top = '-50px'
                },4000)
                get_vehicles_data()
            })
        }
        

        // add exit details
        function enter_exit_details(){
            let url = 'http://127.0.0.1:8000/api/add-exit'

            const base64Canvas = exit_canvas.toDataURL("image/png");

            fetch(url,{
                method:'POST',
                headers:{
                    "Content-type":'application/json',
                    "X-CSRFToken":csrf_token
                },
                body:JSON.stringify({
                    'img':base64Canvas
                })
            })
            .then((resp)=>resp.json())
            .then((data)=>{
                console.log(data)
                document.getElementById('exit-enter').click()
                if(!data['permission']){
                    console.log('visitors')
                    document.getElementById('exit-alert').style.display='flex'
                    document.getElementById('alert-sound').play()
                    
                }
                else{
                    document.getElementById('exit-msg').style.top = '10px'
                    setTimeout(()=>{
                        document.getElementById('exit-msg').style.top = '-50px'
                        get_vehicles_data()
                    },4000)
                }
            })


        }

        window.onload = ()=>{
            get_vehicles_data()
            document.getElementById('entry-snap').addEventListener('click',()=>{
                entry_context.drawImage(entry_video,0,0)
                get_car_number()
            });
            document.getElementById('exit-snap').addEventListener('click',()=>{
                exit_context.drawImage(exit_video,0,0)
                enter_exit_details()
            });

            document.getElementById('enterDetailsBtn').addEventListener('click',add_visitors_entry)
        };
