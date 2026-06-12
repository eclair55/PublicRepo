using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class Councilor
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public string Term { get; set; }

    [JsonIgnore]
    public ICollection<Document> Documents { get; set; }
}