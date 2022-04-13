const submitBtn = document.getElementById('sub-btn')
const form = document.getElementById('form')

const disable = () => {
    Array.from(form.elements).forEach(el => el.setAttribute('disabled', true))
}

const enable = () => {
    Array.from(form.elements).forEach(el => el.removeAttribute('disabled'))
}

form.addEventListener('submit', e => {
    e.preventDefault()
    submitBtn.setAttribute('disabled', true)
    document.getElementById('uploading').style.display = 'inline'
    const data = new FormData()
    data.append('file', e.target[0].files[0])
    disable()
    fetch('/upload', {
        method: 'post',
        body: data
    })
        .then(res => res.json())
        .then(data => {
            enable()
            document.getElementById('uploading').style.display = 'none'
            if (data.success) {
                document.getElementById('uploaded').style.display = 'inline'
                window.setTimeout(() => {
                    document.getElementById('uploaded').style.display = 'none'
                }, 3000)
                fetchFiles()
            } else {
                throw new Error(data.error)
            }
        })
        .catch(err => {
            enable()
            document.getElementById('failed').style.display = 'inline'
            window.setTimeout(() => {
                document.getElementById('failed').style.display = 'none'
            }, 3000)
            document.getElementById('uploading').style.display = 'none'
        })
    form.reset()
})