
$(document).ready(function(){


    //window.onload = console.log("okkkkkkkkkkk");


    var active;
    var movieStore = [];
    var pageNumber;
    var clockHours;
 


    $( document ).ready(function() {
        pageNumber = 0;
        clockHours = 0;
        active = "";
    });



    function get_priority(voteAverage){

        var movieWeight;
        var moviePriority;
        var thresh;

        //console.log(clockHours);

        if(clockHours != 0){
            thresh = 3.6;
        }
        else{
            thresh = 3.0;
        }

       // console.log("Thresh Value : ",thresh);

        movieWeight = .49 + (clockHours * .03);
        moviePriority = movieWeight * voteAverage;

        //console.log("Priority val : ",moviePriority);

        if(moviePriority > thresh){
            return 1;
        }
        else
        {
            return -1;
        }
    }



    function load_cache(jsonData){

        for(i = 0;i<jsonData.length;i++)
        {
                movieStore.push({id: jsonData[i]["id"], original_title: jsonData[i]["title"], poster_path: jsonData[i]["poster_path"],overview:jsonData[i]["overview"]});
                //movieStore.push(object); 
        }
        //console.log("movieStoe:",movieStore);

    }


    function load_content()
    {
        //console.log(pageNumber);
        pageNumber = pageNumber + 1;
        if(active == "select")
        {
           search_genre(pageNumber,$('#sel1').val());
           $(".loadArea").empty();
        }
    }


    function search_title(data)
    {
      $("#frontPage").fadeOut();
        $.ajax({
            url: "/findTitle/" + data,
            type: "GET",
            success: function(rsp)
            {
                load_cache(rsp.data);
                create_layout(data,rsp.data);  

            }
        });
    }

    function search_genre(page,data)
    {
      $("#frontPage").fadeOut();
        $.ajax({
            url: "/findGenre/"+page+"/"+data,
            type: "GET",
            success: function(rsp)
            {
                load_cache(rsp.data);
                create_layout(data,rsp.data);  
            }
        });
    }


    function create_layout(data,movieData)
    {
        $(".searchResults").empty();

        title = "<div style='text-align:left;'><h3 style='color:rgb(100,100,300);font-family : Century Gothic, sans-serif;'> Results for : "+data+"</h3></div><hr>"
        $(".searchResults").append(title);
        
        var path;
        var time;
        var status;
        var newDiv;
        var loadButton;
        count = 1;
        for( i = 0;i<movieData.length;i++)
        {
           if(movieData[i]["poster_path"] != null)
           {
             path = 'https://image.tmdb.org/t/p/w185/'+movieData[i]["poster_path"]

             if(get_priority(movieData[i]["vote_average"]) == 1)
             {
                 time = 'static/css/img/yesTime.png'
                 status = "worth your time !"

             }
             else
             {
                 time = 'static/css/img/noTime.png'
                 status = "not worth it !"
             }
             
             newDiv =
             '<div class="col-sm-4 col-med-4">'
             +'<div class="back" style="background-color : white;margin:2%; opacity:0.8">' 
             +'<div class="row">'
            // +'<div class="col-xs-12 col-sm-6 col-md-8">'
             +'<div class="col-sm-8">'
             //+'<p style="">'+movieData[i]["original_title"]+'</p><br>'
             +'<div class="hovereffect">'
             +'<img class="img-responsive" src='+path+' style="">'
             +'<div class="overlay">'
             +'<h2>'+status+'</h2>'
             +'<h3 class="info" id="'+movieData[i]["id"]+'"><button type="button"data-toggle="modal" data-target="#myModal">Overview</button></h3>'
             
             
             //+'<h3 class="info" id="'+movieData[i]["id"]+'"><button id="myBtn">Overview</button></h3>'
             
             +'</div>'
             +'</div>'
             +'</div>'
             +'<div class="col-xs-12 col-sm-4 col-md-4">'
             +'<img class="img-responsive" src='+time+'>'
             +'</div>'
             +'</div>'
             +'</div>'
             +'</div>'



             

            $(".newsSection").append(newDiv);

             document.getElementById(movieData[i]["id"]).onclick = function() { 
                display_summary(this.id); 
            };

          }
        }
        loadButton = document.createElement("BUTTON");
        loadButton.setAttribute("class", "load btn btn-primary btn-lg btn-block");
        loadButton.setAttribute("id", "load-btn");
        loadButton.setAttribute("type", "button");
        loadButton.style.margin = "auto";

        loadButton.innerHTML = 'Load More';

        $(".loadArea").append(loadButton);

         document.getElementById("load-btn").onclick = function() { 

            load_content();
             
        };

   }

    


    function display_summary(id)
    {
        $(".summaryTitle").empty();
        $(".content").empty();

        //console.log("In summary func.");

        for(i = 0;i<movieStore.length;i++)
        {
            if(movieStore[i]["id"] == id)
            {
                path = 'https://image.tmdb.org/t/p/w185/'+movieStore[i]["poster_path"]
                title = movieStore[i]["original_title"];
                $(".summaryTitle").append(title);

                overview =   
                '<div class="col-sm-6 col-md-4 col-lg-6">'
                +'<img class="img-responsive"  style="width:60%" src='+path+'>'                
                +'</div>'
                +'<div class="col-sm-6 col-md-4 col-lg-6">'
                +'<p>'+movieStore[i]["overview"]+'<p>'
                +'</div>'
    
                $(".content").append(overview);
                window.open("#popup1","_self");


                /*window.open("","_self");*/
                //window.close("","_self");
            }
        }

        //console.log("Store length:",i);
    }



    $(document).ready(function () {

        $('#sel1').change(function () {

            //console.log("sel value: ",$(this).val())
            active = "select";

            $(".loadArea").empty();
            $(".newsSection").empty();
            $(".searchResults").empty();
            pageNumber = 0;
            movieStore = [];



            search_genre(pageNumber,$(this).val());
        })
    });


   
    $("#submit").click(function(evt) {
        var searchBarVal = $("#theSearch").val();
        evt.preventDefault();
        //console.log("searchbarVal:",searchBarVal);
        active = "searchBar";
        pageNumber = 0;
        movieStore = [];

        $(".loadArea").empty();
        $(".newsSection").empty();
        $(".searchResults").empty();

       search_title(searchBarVal);

    });



    $('.clockpicker').clockpicker()
        .find('input').change(function(){
            // TODO: time changed
            clockHours = this.value[1];
           // console.log(this.value[1]);

            if(active == "select")
            {
                $(".loadArea").empty();
                $(".newsSection").empty();
                movieStore = [];

                search_genre(pageNumber,$('#sel1').val());  
            }
            else
            if(active == "searchBar")
            {
                $(".loadArea").empty();
                $(".newsSection").empty();
                movieStore = [];
                search_title($("#theSearch").val());
            }
           
        });
    $('#demo-input').clockpicker({

        autoclose: true

    });

    hljs.configure({tabReplace: '    '});
    hljs.initHighlightingOnLoad();

    



 






    var directory = "static/css/img/";
    var imageList = [];
    var item;

    for(i = 1;i<7;i++)
    {
        item = directory+"pic"+i+".jpg";
        imageList.push(item);
    }

    var backgroundImage;

    function backgroundInit(){

        var bkg;
        if(document.cookie != ""){

            bkg =  getCookie("backgroundImage");
            //console.log("cookie :"+bkg);
        }
        else
        {
            bkg = "static/css/img/pic1.jpg";
        }

        backgroundImage = bkg;
        $('body').css('background-image', 'url('+backgroundImage+')');

    }

    function getCookie(cname) 
    {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i];
            while (c.charAt(0)==' ') 
            {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) 
            {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }


    function setCookie(theImage){
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 20);
        backgroundImage = theImage;
        document.cookie =  "backgroundImage="+backgroundImage+";path=/;expires="+expireDate.toGMTString();
        //console.log(document.cookie);
    }


    var j = 0;

    $("#changeB").click(function(evt) {
        evt.preventDefault();
        $('body').css('background-image', 'url('+imageList[j]+')');
        setCookie(imageList[j]);
        j++;
        if(j == 6)
        {
            j = 0;
        } 
    });

	new WOW().init();


});

