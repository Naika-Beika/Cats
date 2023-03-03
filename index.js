
const $wrapper = document.querySelector('[data-wr]');
const $addBtn = document.querySelector('[data-add_button]');
const $modalAdd = document.querySelector('[data-modal]');
const $closeBtn = document.querySelector('[data-close_button]');
const $formErrorMsg = document.querySelector('[data-errmsg]');
const $modalCat = document.querySelector('[data-current_cat]');

const HIDDEN_CLASS = 'hidden'

const generateCatCard = (cat) => {
    return (
    `<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem;">
    <img src="${cat.image}" class="card-img-top" alt="Photo">
    <div class="card-body">
      <h5 class="card-title">${cat.name}</h5>
      <p class="card-text">${cat.description}</p>
      <button type="button" data-action="open" class="btn btn-primary">Open</button>
      <button type="button" data-action="edit" class="btn btn-warning">Edit</button>
      <button type="button" data-action="delete" class="btn btn-danger">Delete</button>
    </div>
  </div>`
  )
}

$wrapper.addEventListener('click', async (event) => {
  const action = event.target.dataset.action
  
  switch (action) {
    case 'delete':
      const $currentCard = event.target.closest('[data-card_id]')
      const catId = $currentCard.dataset.card_id;
      try {
        const res = await api.deleteCat(catId);
        const response = await res.json();
        if(!res.ok) throw Error(response.message)
        $currentCard.remove()
      } catch (error) {
        console.log(error);
      }
      
      break;
    
    case 'open':   
       const $currentCat = event.target.closest('[data-card_id]')
       const currentId = $currentCat.dataset.card_id;
       try {
        const res = await api.getCurrentCat(currentId);
        const response = await res.json()
        $modalCat.classList.toggle(HIDDEN_CLASS)
       }catch (error) {
        console.log(error);
      }
    
      break;

    case 'edit':
      
      break;
    default:
      break;
  }
})

$addBtn.addEventListener('click', (event) => {
  $modalAdd.classList.remove(HIDDEN_CLASS)
})

//AddEventListener по закрытию модалки
$closeBtn.addEventListener('click', (event) => {
  
  $modalAdd.classList.remove(HIDDEN_CLASS)
}) 


document.forms.add_cats_form.addEventListener('submit', async (event) => {
  event.preventDefault();
  $formErrorMsg.innerText = '';

  const data = Object.fromEntries(new FormData(event.target).entries());

  data.id = Number(data.id)
  data.age = Number(data.age)
  data.rate = Number(data.rate)
  data.favorite = !!data.favorite

  const res = await api.addNewCat(data)

  if (res.ok) {
    $wrapper.replaceChildren();
    getCatsFunc()
    $modalAdd.classList.add(HIDDEN_CLASS)
    return event.target.reset()
  } else {
    const responce = await res.json();
    $formErrorMsg.innerText = responce.message
    return;
  }
})


const getCatsFunc = async () => {
  const res = await api.getAllCats();

    if (res.status !== 200) {
    const $errorMessage = document.createElement('p');
    $errorMessage.classList.add('error-msg');
    $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';

    return $wrapper.appendChild($errorMessage);
  } 

  const data = await res.json();

    if (data.length === 0) {
    const $notificationMessage = document.createElement('p');
    $notificationMessage.innerText = 'Список котов пуст, добавьте первого котика';

    return $wrapper.appendChild($notificationMessage);
  } 

  data.forEach(cat => {
    $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
  })
}
getCatsFunc();