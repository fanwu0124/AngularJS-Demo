using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace AngularJS_Demo
{
    /// <summary>
    /// Summary description for StudentService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class StudentService : System.Web.Services.WebService
    {
        [WebMethod]
        public void GetAllStudents()
        {
            System.Threading.Thread.Sleep(2000); //Add a delay in data loading to test route resolve property. Without route resolve, students page is opened with no student list. Student list will load after 2 seconds.
            List<Student> listStudents = new List<Student>();

            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("Select * from tblStudents", con);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Student student = new Student();
                    student.id = Convert.ToInt32(rdr["Id"]);
                    student.name = rdr["Name"].ToString();
                    student.gender = rdr["Gender"].ToString();
                    student.city = rdr["City"].ToString();
                    listStudents.Add(student);
                }
            }

            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(listStudents));
        }

        [WebMethod]
        public void GetStudent(int id)
        {
            Student student = new Student();

            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("Select * from tblStudents where id = @id", con);
                SqlParameter param = new SqlParameter() { ParameterName = "@id", Value = id };
                cmd.Parameters.Add(param);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    student.id = Convert.ToInt32(rdr["Id"]);
                    student.name = rdr["Name"].ToString();
                    student.gender = rdr["Gender"].ToString();
                    student.city = rdr["City"].ToString();
                }
            }

            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(student));
        }

        [WebMethod]
        public void GetStudentsByName(string name)
        {
            List<Student> listStudents = new List<Student>();

            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("Select * from tblStudents where name like @name", con);
                SqlParameter param = new SqlParameter() {
                    ParameterName = "@name",
                    Value = name + "%"
                };
                cmd.Parameters.Add(param);

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Student student = new Student();
                    student.id = Convert.ToInt32(rdr["Id"]);
                    student.name = rdr["Name"].ToString();
                    student.gender = rdr["Gender"].ToString();
                    student.city = rdr["City"].ToString();
                    listStudents.Add(student);
                }
            }

            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(listStudents));
        }

    }
}
