using System.ComponentModel.DataAnnotations;
using System.IO.Pipelines;

namespace DOAN.API.ViewModel
{
    public class Test
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public int? tuoi { get; set; }
    }
}
