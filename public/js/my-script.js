/**
 * Created by saan on 10/11/13.
 */

var STUDENT_METHOD ={

        handlerData:function(resJSON){

            var templateSource   = $("#student-template").html(),

                template = Handlebars.compile(templateSource),

                studentHTML = template(resJSON);

           $('#my-container').html(studentHTML);
            console.log($("#student-template"))
        },
        loadStudentData : function(){

            $.ajax({
                url:"http://localhost:8000/data/studentData.json",
                method:'get',
                success:this.handlerData

            })
        }
};

$(document).ready(function(){

    STUDENT_METHOD.loadStudentData();
});