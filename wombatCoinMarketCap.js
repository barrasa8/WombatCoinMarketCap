let baseURL = "https://api.coingecko.com/api/v3";

//Local Storage
if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    localStorage.setItem("currency", "usd");
    localStorage.setItem("currentPage",1);
    localStorage.setItem("perPage",50);
    localStorage.setItem("title","Top Cryptocurrencies by Marketcap Capitalization");
    localStorage.setItem("currencySymbol","$");
    localStorage.setItem("cryptoData","");
} else {
window.alert("Sorry, no local storage");
}


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

const fetchCryptoCurrencyData = async (baseURL,currency,perPage,page) => {
    try{

        let endpoint = "/coins/markets?vs_currency="+currency+"&order=market_cap_desc&per_page="+perPage+"&page="+page+"&sparkline=false&price_change_percentage=24h";
        let url = baseURL + endpoint;

        
        let res =  await fetch(url);
        let data = await res.json();

        localStorage.setItem("cryptoData",JSON.stringify(data));
        
        return data;

    }catch(err){
        console.log(err);
    }
}

const fetchExchangeData = async (baseURL,perPage,page) =>{
    try{
        let endpoint="/exchanges?per_page="+perPage+"&page="+page;
        let url = baseURL + endpoint;

        let res =  await fetch(url);
        let data = await res.json();

        localStorage.setItem("cryptoData",JSON.stringify(data));

        return data;

    }catch(err){
        console.log(err);
    }
}

const printExchangeTable =  async (doFetch,baseURL,perPage,page) => {
    try{
        let data;
        
        if(doFetch){
            data = await fetchExchangeData(baseURL,perPage,page);
            cleanTable();
            $('#here-table').append(
                '<table class="table table-hover" >'
                +'<thead>'
                +'<tr>'
                +'  <th scope="col">Rank</th>'
                +'  <th scope="col">Name</th>'
                +'  <th scope="col"><span class="table-header-order" id="trustScore" class="isAsc">Trust Score</span></th>'
                +'  <th scope="col"><span class="table-header-order" id="volume24h" class="isAsc">BTC Trade Volume (24h)</span></th>'
                +'  <th scope="col"><span class="table-header-order" id="yearLaunched" class="isAsc">Year Launched</span></th>'
                +'</tr>'
            +'</thead>'
            +'<tbody id="here-tbody">'
            );

            $("#trustScore").click(function(){  
                cleanTableBody();  
                if($("#trustScore").hasClass("isAsc")){
                    $("#trustScore").removeClass("isAsc");
                    orderCryptoTable("trust_score",true); 
                    printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                    //console.log("hellooooo");
                }else{
                    $("#trustScore").addClass("isAsc");
                    orderCryptoTable("trust_score",false);
                    //console.log("hello bye");
                    printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                }
            });            

            $("#volume24h").click(function(){  
                cleanTableBody();  
                if($("#volume24h").hasClass("isAsc")){
                    $("#volume24h").removeClass("isAsc");
                    orderCryptoTable("trade_volume_24h_btc",true); 
                    printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                    //console.log("hellooooo");
                }else{
                    $("#volume24h").addClass("isAsc");
                    orderCryptoTable("trade_volume_24h_btc",false);
                    //console.log("hello bye");
                    printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                }
            }); 

            $("#yearLaunched").click(function(){  
                cleanTableBody();  
                if($("#yearLaunched").hasClass("isAsc")){
                    $("#yearLaunched").removeClass("isAsc");
                    orderCryptoTable("year_established",true); 
                    printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                    //console.log("hellooooo");
                }else{
                    $("#yearLaunched").addClass("isAsc");
                    orderCryptoTable("year_established",false);
                    //console.log("hello bye");
                    printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                }
            }); 

        }else{
            //console.log("this is the value od doFEtch --> " + doFetch)
            data = JSON.parse(localStorage.getItem("cryptoData"));
        };
        for(let i=0 ;i<perPage;i++){
            
            $('#here-tbody').append( '<tr>'
                                        +'<th scope="row">' + data[i].trust_score_rank + '</th>'
                                        +'<th>' +'<img src="'+data[i].image+'" id="table-coin-logo" > ' + data[i].name + '</th>'
                                        +'<td>' + data[i].trust_score + '</td>'
                                        +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].trade_volume_24h_btc)+ '</td>'
                                        +'<td>' + data[i].year_established + '</td>'
                                    +'</tr>'
                                    );
        };

        $("#here-tbody").append(
            '</tbody>'
            +'</table>'
        );
    }catch(err){
        console.log(err);
    }
}

const printCryptoCurrencyTable = async (doFetch,baseURL,currency,perPage,page)=> {
        try{
            let data;

            if(doFetch){
                //console.log("this is the value od doFEtch --> " + doFetch)
                data = await fetchCryptoCurrencyData(baseURL,currency,perPage,page);
                cleanTable();
                $('#here-table').append(
                    '<table class="table table-hover" >'
                    +'<thead>'
                    +'<tr>'
                    +'  <th scope="col">Rank</th>'
                    +'  <th scope="col">Name</th>'
                    +'  <th scope="col"><span class="table-header-order" id="marketCap" class="isAsc">Market Cap</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="price" class="isAsc">Price</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="volume24h" class="isAsc">Volume (24h)</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="supply" class="isAsc">Circulating Supply</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="change24h" class="isAsc">Change (24h)</span></th>'
                    +'</tr>'
                +'</thead>'
                +'<tbody id="here-tbody">'
                );

                $("#marketCap").click(function(){  
                    cleanTableBody();  
                    if($("#marketCap").hasClass("isAsc")){
                        $("#marketCap").removeClass("isAsc");
                        orderCryptoTable("market_cap",true); 
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                       // console.log("hellooooo");
                    }else{
                        $("#marketCap").addClass("isAsc");
                        orderCryptoTable("market_cap",false);
                        //console.log("hello bye");
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                    }
                });

                $("#price").click(function(){  
                    cleanTableBody();  
                    if($("#price").hasClass("isAsc")){
                        $("#price").removeClass("isAsc");
                        orderCryptoTable("current_price",true); 
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                       // console.log("hellooooo");
                    }else{
                        $("#price").addClass("isAsc");
                        orderCryptoTable("current_price",false);
                        //console.log("hello bye");
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                    }
                });

                $("#volume24h").click(function(){  
                    cleanTableBody();  
                    if($("#volume24h").hasClass("isAsc")){
                        $("#volume24h").removeClass("isAsc");
                        orderCryptoTable("total_volume",true); 
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                       // console.log("hellooooo");
                    }else{
                        $("#volume24h").addClass("isAsc");
                        orderCryptoTable("total_volume",false);
                       // console.log("hello bye");
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                    }
                });

                $("#change24h").click(function(){  
                    cleanTableBody();  
                    if($("#change24h").hasClass("isAsc")){
                        $("#change24h").removeClass("isAsc");
                        orderCryptoTable("price_change_percentage_24h",true); 
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                       // console.log("hellooooo");
                    }else{
                        $("#change24h").addClass("isAsc");
                        orderCryptoTable("price_change_percentage_24h",false);
                        //console.log("hello bye");
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                    }
                });

                $("#supply").click(function(){  
                    cleanTableBody();  
                    if($("#supply").hasClass("isAsc")){
                        $("#supply").removeClass("isAsc");
                        orderCryptoTable("total_supply",true); 
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
                       // console.log("hellooooo");
                    }else{
                        $("#supply").addClass("isAsc");
                        orderCryptoTable("total_supply",false);
                       // console.log("hello bye");
                        printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

                    }
                });

            }else{
                //console.log("this is the value od doFEtch --> " + doFetch)
                data = JSON.parse(localStorage.getItem("cryptoData"));
            };

            for(let i=0 ;i<perPage;i++){
                
                $('#here-tbody').append( '<tr>'
                                            +'<th scope="row">' + data[i].market_cap_rank + '</th>'
                                            +'<th>' +'<img src="'+data[i].image+'" id="table-coin-logo" > ' + data[i].name + '</th>'
                                            +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].market_cap) + '</td>'
                                            +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].current_price)+ '</td>'
                                            +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].total_volume) + '</td>'
                                            +'<td>' + formatNumber(data[i].total_supply) + '</td>'
                                            +'<td class="'+RedGreenClassToggle(data[i].price_change_percentage_24h)+'" id="coin'+data[i].market_cap_rank +'">' + data[i].price_change_percentage_24h +' %' + '</td>'
                                        +'</tr>'
                                        );
            };

            $("#here-tbody").append(
                    '</tbody>'
                    +'</table>'
            );
    }catch(err){
        console.log(err);
    }            
}

function ClickNextPage(currentPage){

    localStorage.setItem("currentPage", Number(localStorage.getItem("currentPage"))+1);

    if($("#crypto-tab").hasClass("active")){
        printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));    
    }
    else{
        printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
    }

    if($("#previous-link").hasClass("invisible") && localStorage.getItem("currentPage")>1){
        $("#previous-link").removeClass("invisible");
    }

    if(localStorage.getItem("currentPage")==3){
        $("#next-link").addClass("invisible");
    }

    //Show page in title
    $("#title-page-text").html("(Page " + localStorage.getItem("currentPage") + ")");

    return localStorage.getItem("currentPage");
}

function ClickPreviousPage(currentPage){
    
    localStorage.setItem("currentPage", Number(localStorage.getItem("currentPage"))-1);

    if($("#crypto-tab").hasClass("active")){
        printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));    
    }
    else{
        printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
    }

    if($("#next-link").hasClass("invisible") && localStorage.getItem("currentPage")<5){
        $("#next-link").removeClass("invisible");
    }

    if(localStorage.getItem("currentPage")==1){
        $("#previous-link").addClass("invisible");
    }

    //Show Page in title
    if(localStorage.getItem("currentPage")==1){
        $("#title-page-text").html("");
    }else{
        $("#title-page-text").html("(Page " + localStorage.getItem("currentPage") + ")");
    }

    return localStorage.getItem("currentPage");
}

function cleanTableBody(){
    $("#here-tbody").html("");
}

function cleanTable(){
    $("#here-table").html("");
}

function orderCryptoTable(orderField,isAsc){
    
    let data = JSON.parse(localStorage.getItem('cryptoData'));
    let dataOrdered;

    switch (orderField) {
        case "current_price":
            if(isAsc==true){
                dataOrdered= data.sort((a, b) => parseFloat(b.current_price) - parseFloat(a.current_price));    
            }else if(isAsc==false){
                dataOrdered =  data.sort((a, b) => parseFloat(a.current_price) - parseFloat(b.current_price));
            }
            break;
        case "market_cap":            
            if(isAsc==true){
                dataOrdered =  data.sort((a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap));
            }else{ if(isAsc==false)
                dataOrdered =  data.sort((a, b) => parseFloat(a.market_cap) - parseFloat(b.market_cap));   
            }
            break;
        case "total_volume":
            if(isAsc==true){
                dataOrdered =  data.sort((a, b) => parseFloat(b.total_volume) - parseFloat(a.total_volume));
            }else if(isAsc==false){
                dataOrdered =  data.sort((a, b) => parseFloat(a.total_volume) - parseFloat(b.total_volume));  
            }
            break;
        case "price_change_percentage_24h":
            if(isAsc==true){
                dataOrdered =  data.sort((a, b) => parseFloat(b.price_change_percentage_24h) - parseFloat(a.price_change_percentage_24h));                
            }else if(isAsc==false){
                dataOrdered =  data.sort((a, b) => parseFloat(a.price_change_percentage_24h) - parseFloat(b.price_change_percentage_24h));    
            }
            break;
        case "total_supply":
            if(isAsc==true){
                dataOrdered =  data.sort((a, b) => parseFloat(b.total_supply) - parseFloat(a.total_supply));                
            }else if(isAsc==false){
                dataOrdered =  data.sort((a, b) => parseFloat(a.total_supply) - parseFloat(b.total_supply));    
            }
            break; 
        case "trust_score":
            if(isAsc==true){
                dataOrdered =  data.sort((a, b) => parseFloat(b.trust_score) - parseFloat(a.trust_score));                
            }else if(isAsc==false){
                dataOrdered =  data.sort((a, b) => parseFloat(a.trust_score) - parseFloat(b.trust_score));    
            }
            break;  
        case "trade_volume_24h_btc":
            if(isAsc==true){
                dataOrdered =  data.sort((a, b) => parseFloat(b.trade_volume_24h_btc) - parseFloat(a.trade_volume_24h_btc));                
            }else if(isAsc==false){
                dataOrdered =  data.sort((a, b) => parseFloat(a.trade_volume_24h_btc) - parseFloat(b.trade_volume_24h_btc));    
            }
            break;                 
        case "year_established":
            if(isAsc==true){
                dataOrdered =  data.sort((a, b) => parseFloat(b.year_established) - parseFloat(a.year_established));                
            }else if(isAsc==false){
                dataOrdered =  data.sort((a, b) => parseFloat(a.year_established) - parseFloat(b.year_established));    
            }
            break;                     
        default:
          console.log("Sorry, Not a valide field to sort.");
      };

      localStorage.setItem("cryptoData",JSON.stringify(dataOrdered));
}

document.addEventListener("DOMContentLoaded", () => {
    //insert PerPage number in title
    $(".perPageText").html(localStorage.getItem("perPage"));

    printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

    $("#next-link").click(function(){
        $("#here-table").html("");
        localStorage.setItem("currentPage",ClickNextPage(localStorage.getItem("currentPage")));
    });

    $("#previous-link").click(function(){
        $("#here-table").html("");
        localStorage.setItem("currentPage",ClickPreviousPage(localStorage.getItem("currentPage")));
    });
    
    $("#exchange-tab").click(function(){
        if(!$("#exchange-tab").hasClass("active")){
            $("#crypto-tab").removeClass("active");
            $("#exchange-tab").addClass("active");
            $("#currencyGroupSelect").addClass("invisible");
            cleanTableBody();
            cleanTable();
            localStorage.setItem("currentPage",1);
            $("#previous-link").addClass("invisible");
            $("#title-page-text").html("");
            printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#crypto-tab").click(function(){
        if(!$("#crypto-tab").hasClass("active")){
            $("#exchange-tab").removeClass("active");
            $("#crypto-tab").addClass("active");
            $("#currencyGroupSelect").removeClass("invisible");
            cleanTableBody();
            localStorage.setItem("currentPage",1);
            $("#previous-link").addClass("invisible");
            $("#title-page-text").html("");
            printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#currencyGroupSelect").click(function(){
        localStorage.setItem("currency",$("#currencyGroupSelect option:selected").val());
        if(localStorage.getItem("currency")=="eur"){
            localStorage.setItem("currencySymbol","€");        
        }else{
            localStorage.setItem("currencySymbol","$");        
        }
        cleanTableBody();
        if($("#crypto-tab").hasClass("active")){
            //console.log("crypto tab is active")
            printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }else{
            printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#perPageGroupSelect").click(function(){
        localStorage.setItem("perPage",$("#perPageGroupSelect option:selected").val());
        $(".perPageText").html(localStorage.getItem("perPage"));
        cleanTableBody();
        if($("#crypto-tab").hasClass("active")){
            //console.log("crypto tab is active")
            printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }else{
            printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });  


});
