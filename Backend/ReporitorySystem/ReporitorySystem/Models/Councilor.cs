using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Councilor
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public string Term { get; set; }

    public ICollection<Document> Documents { get; set; }
}