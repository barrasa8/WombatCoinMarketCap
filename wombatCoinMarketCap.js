
document.addEventListener("DOMContentLoaded", () => {

    let baseURL = "https://api.coingecko.com/api/v3";
    let currency ="usd";
    let page = 1;
    let perPage=100;
    let endpoint = "/coins/markets?vs_currency="+currency+"&order=market_cap_desc&per_page="+perPage+"&page="+page+"&sparkline=false&price_change_percentage=24h";
    let url = baseURL + endpoint;

    function formatNumber(number)
    {
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
    }

    fetch(url)
    .then(res=>{

        res.json()
        .then(data=>{

            console.log(data);

            for(let i=0 ;i<perPage;i++){
                
                $('#here-table').append( '<tr>'
                                            +'<th scope="row">' + data[i].market_cap_rank + '</th>'
                                            +'<th>' +'<img src="'+data[i].image+'" id="table-coin-logo" > ' + data[i].name + '</th>'
                                            +'<td>' + "$"+formatNumber(data[i].market_cap) + '</td>'
                                            +'<td>' + "$"+formatNumber(data[i].current_price)+ '</td>'
                                            +'<td>' + "$"+formatNumber(data[i].total_volume) + '</td>'
                                            +'<td>' + formatNumber(data[i].total_supply) + '</td>'
                                            +'<td class="" id="coin'+data[i].market_cap_rank +'">' + data[i].price_change_percentage_24h +' %' + '</td>'
                                        +'</tr>'
                                        );
                if(data[i].price_change_percentage_24h>0){
                    $(".coin"+data[i].market_cap_rank).addClass("red");
                    $(".coin1").addClass("green");
                }else{
                    $(".coin"+data[i].market_cap_rank).addClass("red");
                    $(".coin1").addClass("green");
                }
                

            }                        
            
         

        })

    });

});
