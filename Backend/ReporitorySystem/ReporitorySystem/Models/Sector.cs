using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class Sector
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [JsonIgnore]
    public ICollection<Document> Documents { get; set; }
}