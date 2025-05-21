

function Footer() {
    let year = new Date().getFullYear()
  return (
        <div className="pt-2 pb-1" style={{backgroundColor:"#363636"}}>
          <div className="container">
            <div className="mt-2">
                <p className="text-white"> © Copyright   {year} <a target="_blank" href="https://www.thebdit.com/">Blue Diamond Infotech Pvt Ltd</a> | All Rights Reserved </p>
               
            </div>
          </div>
        </div>

  )
}

export default Footer
