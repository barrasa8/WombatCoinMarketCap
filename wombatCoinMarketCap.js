let baseURL = "https://api.coingecko.com/api/v3";
let currency ="usd";
let page = 1;
let currentPage = page;
let perPage=100;
let title ;



function formatNumber(number){
    if(number===null){
        return "--"
    }

    let decimalParts=2;

    if(number<1){
        decimalParts=5;
    }

    number = number.toFixed(decimalParts) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};
    
function RedGreenClassToggle(price_change_percentage_24h){
    if(price_change_percentage_24h > 0){
        return "green";
    }else{
        return "red";
    }
};

function printCryptoCurrencyTable(baseURL,currency,perPage,page){

    let endpoint = "/coins/markets?vs_currency="+currency+"&order=market_cap_desc&per_page="+perPage+"&page="+page+"&sparkline=false&price_change_percentage=24h";
    let url = baseURL + endpoint;

    fetch(url)
    .then(res=>{

        res.json()
        .then(data=>{

            console.log(data);

            $('#here-table').append(
                '<table class="table table-hover" >'
                +'<thead>'
                +'<tr>'
                +'  <th scope="col">Rank</th>'
                +'  <th scope="col">Name</th>'
                +'  <th scope="col">Market Cap</th>'
                +'  <th scope="col">Price</th>'
                +'  <th scope="col">Volume (24h)</th>'
                +'  <th scope="col">Circulating Supply</th>'
                +'  <th scope="col">Change (24h)</th>'
                +'</tr>'
              +'</thead>'
              +'<tbody id="here-tbody">'
            );

            for(let i=0 ;i<perPage;i++){
                
                $('#here-tbody').append( '<tr>'
                                            +'<th scope="row">' + data[i].market_cap_rank + '</th>'
                                            +'<th>' +'<img src="'+data[i].image+'" id="table-coin-logo" > ' + data[i].name + '</th>'
                                            +'<td>' + "$"+formatNumber(data[i].market_cap) + '</td>'
                                            +'<td>' + "$"+formatNumber(data[i].current_price)+ '</td>'
                                            +'<td>' + "$"+formatNumber(data[i].total_volume) + '</td>'
                                            +'<td>' + formatNumber(data[i].total_supply) + '</td>'
                                            +'<td class="'+RedGreenClassToggle(data[i].price_change_percentage_24h)+'" id="coin'+data[i].market_cap_rank +'">' + data[i].price_change_percentage_24h +' %' + '</td>'
                                        +'</tr>'
                                        );
            }

            $("#here-tbody").append(
                    '</tbody>'
               +'</table>'
            );

        }).catch(err =>{
            console.log(err);
        });

    });
};

function ClickNextPage(currentPage){

    currentPage++;

    if($("#crypto-tab").hasClass("active")){
        printCryptoCurrencyTable(baseURL,"USD",100,currentPage);    
    }
    // else{
    //     printExchangeTable(baseURL,"USD",100,1);
    // }

    if($("#previous-link").hasClass("invisible") && currentPage>1){
        $("#previous-link").removeClass("invisible");
    }

    if(currentPage==5){
        $("#next-link").addClass("invisible");
    }

    //Show page in title
    $("#title-page-text").html("(Page " + currentPage + ")");

    return currentPage;
}

function ClickPreviousPage(currentPage){
    
    currentPage--;

    if($("#crypto-tab").hasClass("active")){
        printCryptoCurrencyTable(baseURL,"USD",100,currentPage);    
    }
    // else{
    //     printExchangeTable(baseURL,"USD",100,1);
    // }

    if($("#next-link").hasClass("invisible") && currentPage<5){
        $("#next-link").removeClass("invisible");
    }

    if(currentPage==1){
        $("#previous-link").addClass("invisible");
    }

    //Show Page in title
    if(currentPage===1){
        $("#title-page-text").html("");
    }else{
        $("#title-page-text").html("(Page " + currentPage + ")");
    }

    return currentPage;
}

document.addEventListener("DOMContentLoaded", () => {

    title = $("#title").text();

    printCryptoCurrencyTable(baseURL,"USD",100,1);

    $("#next-link").click(function(){
        $("#here-table").html("");
        currentPage=ClickNextPage(currentPage);
    });

    $("#previous-link").click(function(){
        $("#here-table").html("");
        currentPage=ClickPreviousPage(currentPage);
    });
    

});
