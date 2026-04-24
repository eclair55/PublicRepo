using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Sector
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public ICollection<Document> Documents { get; set; }
}