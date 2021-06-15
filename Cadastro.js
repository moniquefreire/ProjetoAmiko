const KEY_BD = '@dispositivosestudo'

var listaRegistros = {
     ultimoIdGerado: 0,
     dispositivos:[]
}

var FILTRO = ''

function gravarBD(){
     localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
 }

 function lerBD(){
     const data = localStorage.getItem(KEY_BD)
     if(data){
         listaRegistros = JSON.parse(data)
     }
     render()
 }

 function pesquisar(value){
     FILTRO = value;
     render()
 }

function render(){
     const tbody = document.getElementById('listaRegistrosBody')
     if(tbody){
          var data = listaRegistros.dispositivos;
          if(FILTRO.trim()){
               const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
               data = data.filter( dispositivo => {
                   return expReg.test( dispositivo.modelo ) || expReg.test( dispositivo.quarto ) || expReg.test( dispositivo.hospital) 
               } )
           }
           data = data
           .sort( (a, b) => {
               return a.hospital < b.hospital? -1 : 1
           })
           .map( dispositivo => {
               return `<tr>
                       <td>${dispositivo.id}</td>
                       <td>${dispositivo.modelo}</td>
                       <td>${dispositivo.quarto}</td>
                       <td>${dispositivo.hospital}</td>
                       <td>
                           <button onclick='visualizar("cadastro",false,${dispositivo.id})'>Editar</button>
                           <button class='delete' onclick='perguntarSeDeleta(${dispositivo.id})'>Deletar</button>
                       </td>
                   </tr>`
           } )
          tbody.innerHTML = data.join('')
     }
}

function insertDevice(modelo, quarto, hospital){
     const id = listaRegistros.ultimoIdGerado + 1;
     listaRegistros.ultimoIdGerado = id;
     listaRegistros.dispositivos.push({
          id, modelo, quarto, hospital
     })
    gravarBD()
    render()
    visualizar('lista')
}

function editDevice(id, modelo, quarto, hospital){
    var dispositivo = listaRegistros.dispositivos.find( dispositivo => dispositivo.id == id )
    dispositivo.modelo = modelo;
    dispositivo.quarto = quarto;
    dispositivo.hospital = hospital;
    gravarBD()
    render()
    visualizar('lista')
}

function deleteDevice(id){
     listaRegistros.dispositivos = listaRegistros.dispositivos.filter( dispositivo => {
          return dispositivo.id != id
      } )
      gravarBD()
      render()
}

function perguntarSeDeleta(id){
     if(confirm('Será deletado o registro de ID '+id)){
         deleteDevice(id)
     }
 }
 
 function limparEdicao(){
     document.getElementById('modelo').value = ''
     document.getElementById('quarto').value = ''
     document.getElementById('hospital').value = ''
 }

function visualizar(pagina, novo = false, id = null){
     document.body.setAttribute('page', pagina)
     if(pagina === 'cadastro'){
          if(novo) limparEdicao()
          if(id){
              const dispositivo = listaRegistros.dispositivos.find( dispositivo => dispositivo.id == id )
              if(dispositivo){
                  document.getElementById('id').value = dispositivo.id
                  document.getElementById('modelo').value = dispositivo.modelo
                  document.getElementById('quarto').value = dispositivo.quarto
                  document.getElementById('hospital').value = dispositivo.hospital
            }
        }
          document.getElementById('modelo').focus()
     }
}

function submeter(e){
     e.preventDefault()
     const data = {
         id: document.getElementById('id').value,
         modelo: document.getElementById('modelo').value,
         quarto: document.getElementById('quarto').value,
         hospital: document.getElementById('hospital').value,
     }
     if(data.id){
         editDevice(data.id, data.modelo, data.quarto, data.hospital)
     }else{
         insertDevice(data.modelo, data.quarto, data.hospital)
     }
 }


 window.addEventListener('load', () => {
     lerBD()
     document.getElementById('cadastroRegistros').addEventListener('submit', submeter)
     document.getElementById('inputPesquisa').addEventListener('keyup', e => {
         pesquisar(e.target.value)
     })
 
 })