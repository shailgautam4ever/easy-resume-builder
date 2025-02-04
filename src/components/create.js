import React, { Component, createRef, useRef, useState} from "react";
import Resume from "./resume";
import data from "../mockData";
// import Form from "./Form_old";
import Form from "./Form"
import { themeColors as theme } from "../templates/themes/colors";
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const Create =()=> {

  const [resumeData, setResumeData] = useState(data)
  const [themeColors, setThemeColors] = useState(theme)
  const [currentTheme, setCurrentTheme] = useState(theme[6])
  const resumeRef = useRef()

  const handleOnThemeChange = (theme) =>{
    let root = document.documentElement;
    root.style.setProperty("--themeColor", theme.color);
    setCurrentTheme(theme)
  }

  const handleOnChange = (event, index, type, key) => {
      const { name, value } = event.target;

    if (type === "projects") {
      resumeData[type][index][key] = value;
    } else resumeData[name] = value;
    setResumeData({...resumeData})
  };

  const handleOnAddBtnClick = (e, type) => {
    e.preventDefault();

    if (type === "projects") {
      let newProject = {
        name: "Project Name",
        description: "Project Description",
      };
      resumeData.projects.push(newProject);
    } else if (type === "experience") {
      let newExp = {
        name: "Company Name",
        description: "Job Description",
        to: "",
        from: "",
      };
      resumeData.experience.push(newExp);
    }
    setResumeData({...resumeData})
  };

  const handleOnRemove = (e, type, key) => {
    e.preventDefault();
    console.log(e, type, key);
    resumeData[type].splice(key, 1);
    setResumeData({...resumeData})
  };

  const handleOnSubmit = (event) => {
    console.log('inside function')
    event.preventDefault();
    printPdfAsImage()
    // printPDF()
  };

  function makePDF(e) {
    e.preventDefault()
    var quotes = document.getElementById('resume-preview');

    html2canvas(quotes).then(canvas => {


        //! MAKE YOUR PDF
        // var pdf = new jsPDF('p', 'pt', 'letter');
        var pdf = new jsPDF('p', 'pt', 'a4');

        for (var i = 0; i <= quotes.clientHeight/980; i++) {
            //! This is all just html2canvas stuff
            var srcImg  = canvas;
            var sX      = 0;
            var sY      = 980*i; // start 980 pixels down for every new page
            var sWidth  = 900;
            var sHeight = 980;
            var dX      = 0;
            var dY      = 0;
            var dWidth  = 900;
            var dHeight = 980;

            window.onePageCanvas = document.createElement("canvas");
            window.onePageCanvas.setAttribute('width', 900);
            window.onePageCanvas.setAttribute('height', 980);
            var ctx = window.onePageCanvas.getContext('2d');
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

            // document.body.appendChild(canvas);
            var canvasDataURL = window.onePageCanvas.toDataURL("image/png", 1.0);

            var width         = window.onePageCanvas.width;
            var height        = window.onePageCanvas.clientHeight;

            //! If we're on anything other than the first page,
            // add another page
            if (i > 0) {
                pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
            }
            //! now we declare that we're working on that page
            pdf.setPage(i+1);
            //! now we add content to that page!
            pdf.addImage(canvasDataURL, 'PNG', 40, 40, (width*.62), (height*.62));

        }
        pdf.output('dataurlnewwindow');
        //! after the for loop is finished running, we save the pdf.
        // pdf.save('test.pdf');
    });
}

  const printPdfAsImage = () => {
    const input = document.getElementById('resume-preview');
    if(!input) {
      alert('Invaid Resume Section')
      return
    }
    console.log({input})
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF("p", "px", "a4"); // 'p', 'pt', 'letter'
        const w = pdf.internal.pageSize.getWidth()
        const h = pdf.internal.pageSize.getHeight()
        // pdf.html(input.innerHTML, {
        //   x: 10, y: 10
        // })
        // pdf.autoPrint();
        pdf.addImage(imgData, 'png', 0, 0);
        pdf.output('dataurlnewwindow');
        // pdf.save("download.pdf");
      })
  }
  function printPDF() {
    const div = resumeRef.current
    console.log(div);
    const printDoc = new jsPDF();
    printDoc.html(div, {
      width: 180,
      // x: 10,
      // y: 10
    });
    printDoc.autoPrint();
    printDoc.output("dataurlnewwindow"); // this opens a new popup,  after this the PDF opens the print window view but there are browser inconsistencies with how this is handled
    // printDoc.save("download.pdf");
  }

    return (
      <div className="landing create-landing">
        <div className="create-landing-title">
          <h1>Easy Resume Builder</h1>
        </div>
        <div className="rb-wapper">
          <div id ='rb-preview'  className="rb-form-wapper">
            <Form
              resumeData={resumeData}
              handleOnChange={handleOnChange}
              handleOnAddBtnClick={handleOnAddBtnClick}
              handleOnRemove={handleOnRemove}
              handleOnSubmit={makePDF}
            />
          </div>
          <div className="rb-preview">
            <Resume currentTheme={currentTheme} resumeData={resumeData} resumeRef={resumeRef} />
          </div>
          <div className="rb-settings">
            <p>Theme Color</p>
            <div className="df fw">
              {themeColors.map((c, i) => (
                <div
                  onClick={() => handleOnThemeChange(c)}
                  title={c.title}
                  className="single-theme-item"
                  style={{
                    backgroundColor: c.color,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }


export default Create;
