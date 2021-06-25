

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

// get members data
function get_members_data(){
    let url = 'http://127.0.0.1:8000/api/get-members-data'

        let table = document.querySelector('#members-data tbody');
        table.innerHTML = ''

        fetch(url)
        .then((resp)=>resp.json())
        .then((data)=>{
            console.log('Data:',data)
            let list = data
            let sn = 0 
            let vehicle_type = '🚗'
            for(let i=0; i<list.length;i++){
                
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
                        <td><a href="tel:${list[i].phone_number}">${list[i].phone_number}</a></td>
                        <td><a href="mailto:${list[i].email_id}">${list[i].email_id}</a></td>
                        <td>${list[i].flat_address}</td>
                        <td>${list[i].date_added}</td>
                    </tr>
                `
                table.innerHTML+=car;
            }

            // vehicles_list = list
        })
        
    }
    
// add member
function add_members_entry(number){
    let url = 'http://127.0.0.1:8000/api/add-members-data'

    let type = (document.querySelector('input[name="type"]:checked').value == 'true')

    fetch(url,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrf_token
        },
        body:JSON.stringify({
            'number':document.getElementById('car-number').value,
            'name':document.getElementById('name').value,
            'phone':document.getElementById('phone').value,
            'email':document.getElementById('email').value,
            'address':document.getElementById('flat-address').value,
            'type':type
        })
    })
    .then((resp)=>resp.json())
    .then((data)=>{
        console.log(data['action'])
        if(data['action']){
            document.getElementById('add-msg').style.top = '10px'
            setTimeout(()=>{
                document.getElementById('add-msg').style.top = '-50px'
                get_members_data()
            },4000)
        }
        else{
            document.getElementById('error-msg').style.top = '10px'
            setTimeout(()=>{
                document.getElementById('error-msg').style.top = '-50px'
                // get_members_data()
            },4000)
            
        }
    })
}

// serach member

window.onload = ()=>{
        get_members_data()
        document.getElementById('addMemberBtn').addEventListener('click',add_members_entry)
        document.getElementById('serachMemberBtn').addEventListener('click',search_member)
    };